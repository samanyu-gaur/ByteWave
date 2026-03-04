/**
 * useAnalytics — thin Posthog wrapper
 *
 * Set VITE_POSTHOG_KEY in your .env file to enable:
 *   VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
 *   VITE_POSTHOG_HOST=https://app.posthog.com   (optional, defaults to US cloud)
 *
 * The module is a no-op when the key is missing — safe to call everywhere.
 *
 * To install: npm i posthog-js
 */

let ph = null

export function initAnalytics(userId) {
  const key  = import.meta.env.VITE_POSTHOG_KEY
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
  if (!key) return

  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, { api_host: host, capture_pageview: true, persistence: 'localStorage' })
    if (userId) posthog.identify(userId)
    ph = posthog
  }).catch(() => {})
}

/**
 * Fire a named analytics event.
 * Properties are merged with default session context automatically.
 *
 * @param {string} event  e.g. 'case_completed', 'feedback_viewed', 'skill_map_opened'
 * @param {object} props  optional key/value pairs
 */
export function track(event, props = {}) {
  if (!ph) return
  try { ph.capture(event, props) } catch {}
}

/**
 * Identify the current user (call after sign-in / sign-up).
 * @param {string} userId
 * @param {object} traits  e.g. { email, name, isGuest }
 */
export function identify(userId, traits = {}) {
  if (!ph) return
  try { ph.identify(userId, traits) } catch {}
}

/** Call on sign-out to reset the Posthog distinct ID. */
export function resetIdentity() {
  if (!ph) return
  try { ph.reset() } catch {}
}

// ─── Convenience event names (avoids typos across the codebase) ───────────────
export const EVENTS = {
  SIGN_UP:            'sign_up',
  SIGN_IN:            'sign_in',
  GUEST_START:        'guest_start',
  CASE_STARTED:       'case_started',
  CASE_SUBMITTED:     'case_submitted',
  FEEDBACK_VIEWED:    'feedback_viewed',
  VIDEO_PLAYED:       'video_played',
  SKILL_MAP_OPENED:   'skill_map_opened',
  TOPIC_SELECTED:     'topic_selected',
  FORUM_POST_CREATED: 'forum_post_created',
  WAITLIST_JOINED:    'waitlist_joined',
  ONBOARDING_DONE:    'onboarding_done',
  FIRST_CASE_DONE:    'first_case_done',
}
