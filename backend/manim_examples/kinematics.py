from manim import *
import numpy as np

class ProjectileMotion(MovingCameraScene):
    def construct(self):
        # --- EASILY CONFIGURABLE VARIABLES ---
        initial_velocity = 8.0         # Change this to launch faster/slower (e.g. 10.0)
        angle_in_degrees = 60          # Change this to launch steeper/shallower (e.g. 45)
        # -------------------------------------

        # Physics Parameters
        v0 = initial_velocity
        theta = angle_in_degrees * DEGREES
        g = 9.8               # Gravity
        
        # Derived Initial Variables
        v0x = v0 * np.cos(theta)
        v0y = v0 * np.sin(theta)
        
        # Trajectory equations:
        # x(t) = v0x * t
        # y(t) = v0y * t - 0.5 * g * t^2
        # v_y(t) = v0y - g * t
        
        # Max height calculations
        t_max_height = v0y / g
        h_max = (v0y**2) / (2 * g)
        x_max_height = v0x * t_max_height
        
        # Total flight time and horizontal distance
        t_flight = 2 * t_max_height
        x_final = v0x * t_flight
        
        # Center the scene horizontally and place it toward the bottom
        # x_final / 2 is the literal center of the curve, so we start the ball at - (x_final / 2)
        start_point = np.array([-(x_final / 2), -2, 0])
        ground = Line(start_point + LEFT*2, start_point + RIGHT * (x_final + 2), color=GREEN)
        self.play(Create(ground))
        
        # The Ball & Tracker
        ball = Circle(radius=0.2, color=BLUE, fill_opacity=1).move_to(start_point)
        time_tracker = ValueTracker(0)
        
        def get_pos(t):
            x = start_point[0] + v0x * t
            y = start_point[1] + v0y * t - 0.5 * g * (t**2)
            return np.array([x, y, 0])
            
        ball.add_updater(lambda m: m.move_to(get_pos(time_tracker.get_value())))
        
        # Trail
        path = TracedPath(ball.get_center, stroke_width=4, stroke_color=YELLOW)
        
        self.play(FadeIn(ball), run_time=1.0)
        self.add(path)
        
        # --- Vectors (Free Body & Velocity) ---
        
        # Gravity is constant
        gravity_arrow = always_redraw(lambda: Arrow(
            start=ball.get_center(),
            end=ball.get_center() + DOWN * 1.5,
            buff=0, color=ORANGE, max_tip_length_to_length_ratio=0.15
        ))
        g_label = always_redraw(lambda: Text("g", font_size=20, color=ORANGE).next_to(gravity_arrow.get_end(), DOWN, buff=0.1))

        # Velocity Vectors
        scale_v = 0.25
        
        # X Velocity (Constant)
        vx_arrow = always_redraw(lambda: Arrow(
            start=ball.get_center(),
            end=ball.get_center() + RIGHT * v0x * scale_v,
            buff=0, color=RED, max_tip_length_to_length_ratio=0.15
        ))
        
        # Y Velocity (Changes over time)
        def get_vy():
            return v0y - g * time_tracker.get_value()
            
        vy_arrow = always_redraw(lambda: Arrow(
            start=ball.get_center(),
            end=ball.get_center() + UP * get_vy() * scale_v if abs(get_vy()) > 0.1 else ball.get_center(),
            buff=0, color=RED, max_tip_length_to_length_ratio=0.15
        ))
        
        # Total Velocity Vector
        v_total_arrow = always_redraw(lambda: Arrow(
            start=ball.get_center(),
            end=ball.get_center() + np.array([v0x * scale_v, get_vy() * scale_v, 0]),
            buff=0, color=PURPLE, max_tip_length_to_length_ratio=0.15
        ))
        
        vx_label = always_redraw(lambda: Text(f"Vx = {v0x:.1f}", font_size=16, color=RED).next_to(vx_arrow.get_end(), RIGHT, buff=0.1))
        
        # Hide Vy label if Vy is effectively 0 at the top to make it visually cleaner
        vy_label = always_redraw(lambda: Text(f"Vy = {get_vy():.1f}", font_size=16, color=RED).next_to(vy_arrow.get_end(), UP if get_vy() > 0 else DOWN, buff=0.1).set_opacity(1 if abs(get_vy()) > 0.5 else 0))

        v_tot_label = always_redraw(lambda: Text(f"V = {np.sqrt(v0x**2 + get_vy()**2):.1f}", font_size=16, color=PURPLE).next_to(v_total_arrow.get_end(), UP+RIGHT, buff=0.1))

        self.add(gravity_arrow, g_label, vx_arrow, vy_arrow, v_total_arrow, vx_label, vy_label, v_tot_label)

        # --- Phase 1: Launch to Apex ---
        
        # Give the viewer time to read the initial vector labels before launching
        self.wait(1)
        
        # Start following the ball with the camera slowly
        self.camera.frame.add_updater(lambda m: m.move_to(ball.get_center()))
        
        self.play(
            time_tracker.animate(rate_func=linear).set_value(t_max_height),
            run_time=2.0
        )
        
        # --- Phase 2: Apex Zoom & Explanation ---
        
        # Stop tracking momentarily to zoom
        self.camera.frame.clear_updaters()
        
        # Zoom in on the ball at max height
        self.play(self.camera.frame.animate.scale(0.5).move_to(ball.get_center()), run_time=1)
        
        apex_text = Text("Max Height Reached!", font_size=24, color=YELLOW).next_to(ball, UP*2)
        vy_zero_text = Text("Vy = 0 m/s", font_size=20, color=RED).next_to(apex_text, DOWN)
        
        self.play(Write(apex_text), Write(vy_zero_text))
        self.wait(2)
        
        # Clean up text and zoom back out
        self.play(FadeOut(apex_text), FadeOut(vy_zero_text))
        self.play(self.camera.frame.animate.scale(2).move_to(get_pos(t_max_height + 0.1)), run_time=1)
        
        # Resume tracking
        self.camera.frame.add_updater(lambda m: m.move_to(ball.get_center()))
        
        # --- Phase 3: Fall back to ground ---
        self.play(
            time_tracker.animate(rate_func=linear).set_value(t_flight),
            run_time=2.0
        )
        
        self.camera.frame.clear_updaters()
        
        # Final Zoom Out to see the whole trajectory
        self.play(self.camera.frame.animate.move_to([start_point[0] + x_final/2, start_point[1] + h_max/2, 0]).set(width=16), run_time=2)
        self.wait(1)
