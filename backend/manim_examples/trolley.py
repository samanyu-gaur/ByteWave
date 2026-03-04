from manim import *
import numpy as np

class PulleySystem(Scene):
    def construct(self):
        # Parameters for the physics
        m1 = 2.0  # Mass on the left
        m2 = 5.0  # Mass on the right (Heavier)
        g = 9.8   # Gravity

        # Calculate acceleration (a = g * (m2 - m1) / (m1 + m2))
        acceleration = g * (m2 - m1) / (m1 + m2)
        
        # Geometry Parameters
        pulley_radius = 0.8
        pulley_center = UP * 2
        
        # Initial positions
        # Left mass starts lower, right mass starts higher
        y_left_start = -1.5
        y_right_start = 0.5
        
        left_x = pulley_center[0] - pulley_radius
        right_x = pulley_center[0] + pulley_radius

        # Set up ValueTrackers for the vertical positions of the masses
        left_y_tracker = ValueTracker(y_left_start)
        right_y_tracker = ValueTracker(y_right_start)

        # Draw the Pulley System Static Elements
        ceiling = Line(LEFT * 2, RIGHT * 2, color=GRAY).shift(UP * 3.5)
        ceiling_mount = Line(pulley_center, pulley_center + UP * 1.5, color=WHITE, stroke_width=6)
        pulley = Circle(radius=pulley_radius, color=GRAY, fill_opacity=0.5).move_to(pulley_center)
        pulley_dot = Dot(color=WHITE).move_to(pulley_center)

        self.play(Create(ceiling), Create(ceiling_mount))
        self.play(Create(pulley), Create(pulley_dot))

        # --- Dynamic Elements (Strings and Masses) ---
        
        # Strings are lines that constantly redraw themselves based on tracker positions
        left_string = always_redraw(lambda: Line(
            start=pulley_center + LEFT * pulley_radius,
            end=np.array([left_x, left_y_tracker.get_value(), 0]),
            color=WHITE, stroke_width=3
        ))
        
        right_string = always_redraw(lambda: Line(
            start=pulley_center + RIGHT * pulley_radius,
            end=np.array([right_x, right_y_tracker.get_value(), 0]),
            color=WHITE, stroke_width=3
        ))
        
        # Visual mass block sizes proportional to their masses
        box_width_1 = 0.6 + (m1 * 0.1)
        box_width_2 = 0.6 + (m2 * 0.1)
        
        left_mass = always_redraw(lambda: Rectangle(
            width=box_width_1, height=box_width_1, color=BLUE, fill_opacity=0.8
        ).move_to(np.array([left_x, left_y_tracker.get_value() - box_width_1/2, 0])))
        
        right_mass = always_redraw(lambda: Rectangle(
            width=box_width_2, height=box_width_2, color=RED, fill_opacity=0.8
        ).move_to(np.array([right_x, right_y_tracker.get_value() - box_width_2/2, 0])))

        # Mass labels
        left_label = always_redraw(lambda: Text(f"{m1}kg", font_size=20).move_to(left_mass.get_center()))
        right_label = always_redraw(lambda: Text(f"{m2}kg", font_size=20).move_to(right_mass.get_center()))

        self.play(Create(left_string), Create(right_string))
        self.play(FadeIn(left_mass), FadeIn(right_mass), Write(left_label), Write(right_label))

        # --- Free Body Diagram Vectors ---
        
        # Weight forces (mg)
        w1_len = m1 * 0.3
        w2_len = m2 * 0.3
        
        w1_arrow = always_redraw(lambda: Arrow(
            start=left_mass.get_center(),
            end=left_mass.get_center() + DOWN * w1_len,
            buff=0, color=ORANGE, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        w2_arrow = always_redraw(lambda: Arrow(
            start=right_mass.get_center(),
            end=right_mass.get_center() + DOWN * w2_len,
            buff=0, color=ORANGE, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        
        # Tension force (T)
        # T = m1 * (g + a) = m2 * (g - a)
        T_mag = m1 * (g + acceleration) 
        T_len = T_mag * 0.05 # Scaling factor for visualization
        
        T1_arrow = always_redraw(lambda: Arrow(
            start=left_mass.get_top(),
            end=left_mass.get_top() + UP * T_len,
            buff=0, color=GREEN, stroke_width=4, max_tip_length_to_length_ratio=0.2
        ))
        T2_arrow = always_redraw(lambda: Arrow(
            start=right_mass.get_top(),
            end=right_mass.get_top() + UP * T_len,
            buff=0, color=GREEN, stroke_width=4, max_tip_length_to_length_ratio=0.2
        ))
        
        # Vector Labels
        w1_text = always_redraw(lambda: Text(f"{m1}g", font_size=16, color=ORANGE).next_to(w1_arrow.get_end(), DOWN, buff=0.1))
        w2_text = always_redraw(lambda: Text(f"{m2}g", font_size=16, color=ORANGE).next_to(w2_arrow.get_end(), DOWN, buff=0.1))
        T1_text = always_redraw(lambda: Text("T", font_size=16, color=GREEN).next_to(T1_arrow.get_end(), UP, buff=0.1))
        T2_text = always_redraw(lambda: Text("T", font_size=16, color=GREEN).next_to(T2_arrow.get_end(), UP, buff=0.1))

        self.play(
            GrowArrow(w1_arrow), GrowArrow(w2_arrow), 
            Write(w1_text), Write(w2_text)
        )
        self.play(
            GrowArrow(T1_arrow), GrowArrow(T2_arrow),
            Write(T1_text), Write(T2_text)
        )
        self.wait(1)

        # --- The Kinematics Animation ---
        
        # To make it visibly accelerate from rest, we use rate_functions.ease_in_quad
        # This gives a smooth quadratic acceleration (a * t^2) curve visually.
        
        run_time = 3.0
        total_dist = 0.5 * acceleration * (run_time ** 2) * 0.2 # visual scale factor
        
        self.play(
            left_y_tracker.animate(rate_func=rate_functions.ease_in_quad).set_value(y_left_start + total_dist),
            right_y_tracker.animate(rate_func=rate_functions.ease_in_quad).set_value(y_right_start - total_dist),
            run_time=run_time
        )
        self.wait(2)
