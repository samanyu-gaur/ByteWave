"""
RAG knowledge base using ChromaDB.

One collection:
  - physics_examples: curated physics topic descriptions + working Manim code snippets
"""

import hashlib
import logging
import time
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

RAG_DIR = Path(__file__).resolve().parent
CHROMA_PATH = RAG_DIR / "chroma_data"

_client = None
_examples_col = None


def _get_client():
    global _client
    if _client is None:
        import chromadb
        CHROMA_PATH.mkdir(parents=True, exist_ok=True)
        _client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    return _client


def _get_examples_collection():
    global _examples_col
    if _examples_col is None:
        _examples_col = _get_client().get_or_create_collection(
            name="physics_examples",
            metadata={"hnsw:space": "cosine"},
        )
    return _examples_col


def _make_id(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:32]


# ---------------------------------------------------------------------------
# Physics Examples (curated knowledge base)
# ---------------------------------------------------------------------------

def add_example(
    topic: str,
    description: str,
    manim_code: str,
    visual_rules: str = "",
    metadata: Optional[dict] = None,
) -> str:
    """Add a physics example to the knowledge base. Returns the document id."""
    col = _get_examples_collection()
    doc_id = _make_id(topic + description)
    doc_text = f"Topic: {topic}\n\n{description}"
    if visual_rules:
        doc_text += f"\n\nVisual rules: {visual_rules}"

    meta = {
        "topic": topic,
        "manim_code": manim_code,
        "visual_rules": visual_rules,
        "added_at": str(time.time()),
    }
    if metadata:
        meta.update(metadata)

    try:
        col.upsert(
            ids=[doc_id],
            documents=[doc_text],
            metadatas=[meta],
        )
        logger.debug("Upserted example '%s' (id=%s)", topic, doc_id)
    except Exception as e:
        logger.error("Failed to add example '%s': %s", topic, e)
    return doc_id


def query_examples(question: str, n_results: int = 3) -> list[dict]:
    """
    Retrieve the top-n most similar physics examples for a given question.
    Returns list of dicts with keys: topic, description, manim_code, visual_rules, distance.
    """
    col = _get_examples_collection()
    try:
        count = col.count()
        if count == 0:
            return []
        n = min(n_results, count)
        results = col.query(
            query_texts=[question],
            n_results=n,
            include=["documents", "metadatas", "distances"],
        )
        output = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            output.append({
                "topic": meta.get("topic", ""),
                "description": doc,
                "manim_code": meta.get("manim_code", ""),
                "visual_rules": meta.get("visual_rules", ""),
                "distance": dist,
            })
        return output
    except Exception as e:
        logger.error("query_examples failed: %s", e)
        return []


def list_examples() -> list[dict]:
    """Return all examples in the knowledge base (for admin/debug)."""
    col = _get_examples_collection()
    try:
        all_items = col.get(include=["documents", "metadatas"])
        return [
            {"topic": m.get("topic", ""), "description": d}
            for d, m in zip(all_items["documents"], all_items["metadatas"])
        ]
    except Exception as e:
        logger.error("list_examples failed: %s", e)
        return []


def examples_count() -> int:
    try:
        return _get_examples_collection().count()
    except Exception:
        return 0


