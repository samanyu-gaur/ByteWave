from manim import *
import numpy as np

class GravityOrbit(Scene):
    def construct(self):
        # --- Titles and Formulas ---
        title = Text("Gravity and Orbits", font_size=40, color=BLUE_B).to_edge(UP)
        self.play(Write(title))

        # --- Phase 1: Gravity on Earth's Surface ---
        # Draw a massive arc representing the Earth's surface at the bottom
        earth_surface = Arc(radius=15, angle=PI/6, color=BLUE).move_to(DOWN * 16.5)
        earth_label = Text("Earth", font_size=28, color=BLUE).move_to(DOWN * 3)
        
        # Draw a person standing on the surface
        person = Rectangle(width=0.3, height=0.6, color=WHITE).next_to(earth_surface, UP, buff=0)
        p_label = Text("You", font_size=20).next_to(person, UP, buff=0.1)

        self.play(Create(earth_surface), FadeIn(person), Write(earth_label), Write(p_label))

        # The core formula for Gravity
        formula = Text("Fg = G(M*m) / r²", font_size=32).next_to(title, DOWN, buff=0.5)
        self.play(Write(formula))

        # Free Body Diagram for the person
        # Gravity pulling down towards center of mass
        fg_arrow = Arrow(start=person.get_center(), end=person.get_center() + DOWN*1.8, color=RED, buff=0)
        fg_label = Text("Fg (Weight)", font_size=20, color=RED).next_to(fg_arrow, RIGHT, buff=0.1)

        # Normal force pushing back up
        n_arrow = Arrow(start=person.get_bottom(), end=person.get_bottom() + UP*1.8, color=GREEN, buff=0)
        n_label = Text("Normal Force (N)", font_size=20, color=GREEN).next_to(n_arrow, LEFT, buff=0.1)

        self.play(GrowArrow(fg_arrow), Write(fg_label))
        self.wait(1)
        self.play(GrowArrow(n_arrow), Write(n_label))
        self.wait(2)

        # Clear Phase 1
        self.play(
            FadeOut(person), FadeOut(p_label), FadeOut(fg_arrow), FadeOut(fg_label), 
            FadeOut(n_arrow), FadeOut(n_label), FadeOut(earth_surface), FadeOut(earth_label)
        )

        # --- Phase 2: Moon Orbiting Earth ---
        earth_full = Circle(radius=1.2, color=BLUE, fill_opacity=0.8).move_to(ORIGIN)
        earth_lbl = Text("Earth", font_size=20).move_to(earth_full.get_center())
        
        moon = Circle(radius=0.3, color=GRAY, fill_opacity=1).move_to(RIGHT * 3.5)
        moon_lbl = Text("Moon", font_size=16)

        orbit_path = DashedVMobject(Circle(radius=3.5, color=WHITE))

        self.play(
            Transform(formula, Text("Gravity provides Centripetal Force: Fc = Fg", font_size=28).next_to(title, DOWN, buff=0.5)),
            FadeIn(earth_full), FadeIn(earth_lbl)
        )
        self.play(Create(orbit_path), FadeIn(moon))

        # Orbit Animation Tracker
        angle_tracker = ValueTracker(0)
        
        moon.add_updater(lambda m: m.move_to(
            RIGHT * 3.5 * np.cos(angle_tracker.get_value()) + 
            UP * 3.5 * np.sin(angle_tracker.get_value())
        ))
        moon_lbl.add_updater(lambda m: m.next_to(moon, UP + RIGHT, buff=0.1))
        self.add(moon_lbl)

        # Free Body Vectors for the Moon
        def get_fg_orbit():
            r_vec = earth_full.get_center() - moon.get_center()
            direction = r_vec / np.linalg.norm(r_vec)
            return Arrow(start=moon.get_center(), end=moon.get_center() + direction * 1.5, color=RED, buff=0, max_tip_length_to_length_ratio=0.2)
            
        fg_orbit_arrow = always_redraw(get_fg_orbit)
        fg_orbit_label = always_redraw(lambda: Text("Fg", font_size=20, color=RED).next_to(
            fg_orbit_arrow.get_end(), 
            DOWN if np.sin(angle_tracker.get_value()) > 0 else UP, buff=0.1
        ))

        def get_v_orbit():
            # Tangential velocity (perpendicular to radius)
            r_vec = moon.get_center() - earth_full.get_center()
            tangent = np.array([-r_vec[1], r_vec[0], 0])
            tangent = tangent / np.linalg.norm(tangent)
            return Arrow(start=moon.get_center(), end=moon.get_center() + tangent * 1.5, color=YELLOW, buff=0, max_tip_length_to_length_ratio=0.2)
            
        v_orbit_arrow = always_redraw(get_v_orbit)
        v_orbit_label = always_redraw(lambda: Text("v", font_size=20, color=YELLOW).next_to(
            v_orbit_arrow.get_end(), 
            (v_orbit_arrow.get_end() - moon.get_center()) / np.linalg.norm(v_orbit_arrow.get_end() - moon.get_center()), 
            buff=0.1
        ))

        self.play(FadeIn(fg_orbit_arrow), FadeIn(fg_orbit_label), FadeIn(v_orbit_arrow), FadeIn(v_orbit_label))
        
        # Run orbit (1 full revolution)
        self.play(angle_tracker.animate.set_value(2 * PI), run_time=5, rate_func=linear)
        self.wait(1)

        # Clear Phase 2
        self.play(
            FadeOut(moon), FadeOut(moon_lbl), FadeOut(orbit_path), 
            FadeOut(fg_orbit_arrow), FadeOut(fg_orbit_label), 
            FadeOut(v_orbit_arrow), FadeOut(v_orbit_label),
            FadeOut(earth_lbl)
        )

        # --- Phase 3: Earth Orbiting Sun ---
        # Transform Earth into the Sun
        sun = Circle(radius=1.8, color=ORANGE, fill_opacity=0.9).move_to(ORIGIN)
        sun_lbl = Text("Sun", font_size=24, color=BLACK).move_to(sun.get_center())
        
        self.play(Transform(earth_full, sun), FadeIn(sun_lbl))
        self.play(Transform(formula, Text("Heliocentric Orbit: Fg = G(M_sun * M_earth) / r²", font_size=28).next_to(title, DOWN, buff=0.5)))

        # Create new Earth for this scale
        earth_new = Circle(radius=0.4, color=BLUE, fill_opacity=1).move_to(RIGHT * 4.5)
        earth_new_lbl = Text("Earth", font_size=16)
        sun_orbit_path = DashedVMobject(Circle(radius=4.5, color=GRAY))

        self.play(Create(sun_orbit_path), FadeIn(earth_new))

        sun_angle_tracker = ValueTracker(0)
        earth_new.add_updater(lambda m: m.move_to(
            RIGHT * 4.5 * np.cos(sun_angle_tracker.get_value()) + 
            UP * 4.5 * np.sin(sun_angle_tracker.get_value())
        ))
        earth_new_lbl.add_updater(lambda m: m.next_to(earth_new, UP + RIGHT, buff=0.1))
        self.add(earth_new_lbl)

        # Free Body Vectors for the Earth orbiting Sun
        def get_sun_fg():
            r_vec = sun.get_center() - earth_new.get_center()
            direction = r_vec / np.linalg.norm(r_vec)
            return Arrow(start=earth_new.get_center(), end=earth_new.get_center() + direction * 2, color=RED, buff=0, max_tip_length_to_length_ratio=0.15)
        
        sun_fg_arrow = always_redraw(get_sun_fg)
        sun_fg_label = always_redraw(lambda: Text("Fg", font_size=20, color=RED).next_to(
            sun_fg_arrow.get_end(), 
            DOWN if np.sin(sun_angle_tracker.get_value()) > 0 else UP, buff=0.1
        ))

        def get_sun_v():
            r_vec = earth_new.get_center() - sun.get_center()
            tangent = np.array([-r_vec[1], r_vec[0], 0])
            tangent = tangent / np.linalg.norm(tangent)
            return Arrow(start=earth_new.get_center(), end=earth_new.get_center() + tangent * 2, color=GREEN, buff=0, max_tip_length_to_length_ratio=0.15)
        
        sun_v_arrow = always_redraw(get_sun_v)
        sun_v_label = always_redraw(lambda: Text("v", font_size=20, color=GREEN).next_to(
            sun_v_arrow.get_end(), 
            (sun_v_arrow.get_end() - earth_new.get_center()) / np.linalg.norm(sun_v_arrow.get_end() - earth_new.get_center()), 
            buff=0.1
        ))

        self.play(FadeIn(sun_fg_arrow), FadeIn(sun_fg_label), FadeIn(sun_v_arrow), FadeIn(sun_v_label))

        # Run Earth orbit (1 full revolution)
        self.play(sun_angle_tracker.animate.set_value(2 * PI), run_time=6, rate_func=linear)
        self.wait(2)
