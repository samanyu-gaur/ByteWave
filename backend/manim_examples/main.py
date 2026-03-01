from manim import *
import numpy as np

class CreateCircle(MovingCameraScene):
    def construct(self):
        # Parameters
        angle_in_degrees = 45  # Change this variable to adjust the incline
        theta = angle_in_degrees * DEGREES
        L = 7
        R = 0.5
        
        # Vectors
        # Vector pointing down the incline (right and down)
        fall_vec = np.array([np.cos(theta), -np.sin(theta), 0])
        # Vector pointing perpendicular to the incline (up and right)
        normal_vec = np.array([np.sin(theta), np.cos(theta), 0])
        
        # Geometry
        vertex = np.array([4, -2.5, 0]) # Bottom of the incline
        
        # Ground
        horizontal_line = Line(vertex + np.array([-10, 0, 0]), vertex + np.array([2, 0, 0]), color=GRAY)
        
        # Incline
        start_point = vertex + np.array([-L * np.cos(theta), L * np.sin(theta), 0])
        incline = Line(start_point, vertex, stroke_width=4)
        
        # Angle arc (from incline to ground)
        arc = Arc(radius=1.5, start_angle=PI - theta, angle=theta, arc_center=vertex, color=WHITE)
        label_pos = vertex + np.array([np.cos(PI - theta/2), np.sin(PI - theta/2), 0]) * 2.2
        angle_label = Text(f"{angle_in_degrees}°", font_size=24).move_to(label_pos)

        self.play(Create(horizontal_line), Create(incline))
        self.play(Create(arc), Write(angle_label))
        self.wait(1)

        # Ball elements
        ball_start_pos = start_point + fall_vec * 1.5 + normal_vec * R
        
        circle = Circle(radius=R, color=BLUE, fill_opacity=0.8).move_to(ball_start_pos)
        line1 = Line(UP*R, DOWN*R, color=WHITE).move_to(ball_start_pos)
        line2 = Line(LEFT*R, RIGHT*R, color=WHITE).move_to(ball_start_pos)
        
        ball_group = VGroup(circle, line1, line2)
        self.play(FadeIn(ball_group))

        # Dot in center
        dot = Dot(color=YELLOW)
        dot.add_updater(lambda d: d.move_to(ball_group[0].get_center()))
        self.add(dot)

        # Free body diagram vectors
        mg_len = 2.0
        n_len = mg_len * np.cos(theta)
        # Assuming slipping with friction coefficient mu. Let's make it look smaller than the parallel mg component so it accelerates.
        parallel_mg_len = mg_len * np.sin(theta)
        f_len = parallel_mg_len * 0.4 # Just for visual purposes, friction is less than parallel gravity

        mg_arrow = always_redraw(lambda: Arrow(
            start=ball_group[0].get_center(),
            end=ball_group[0].get_center() + DOWN * mg_len,
            buff=0, color=RED, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        n_arrow = always_redraw(lambda: Arrow(
            start=ball_group[0].get_center(),
            end=ball_group[0].get_center() + normal_vec * n_len,
            buff=0, color=GREEN, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        parallel_mg_arrow = always_redraw(lambda: Arrow(
            start=ball_group[0].get_center(),
            end=ball_group[0].get_center() + fall_vec * parallel_mg_len,
            buff=0, color=ORANGE, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        f_arrow = always_redraw(lambda: Arrow(
            start=ball_group[0].get_center() - normal_vec * R, # Start at the contact point on the ground!
            end=ball_group[0].get_center() - normal_vec * R - fall_vec * f_len, # Friction opposes motion
            buff=0, color=PURPLE, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))

        # Attached labels
        # Note: writing "theta" because LaTeX is uninstalled for the user
        mg_label = always_redraw(lambda: Text("mg", color=RED, font_size=24).next_to(mg_arrow.get_end(), DOWN, buff=0.1))
        n_label = always_redraw(lambda: Text("N", color=GREEN, font_size=24).move_to(n_arrow.get_end() + normal_vec * 0.3 + RIGHT * 0.2))
        parallel_mg_label = always_redraw(lambda: Text("mg sin(θ)", color=ORANGE, font_size=18).next_to(parallel_mg_arrow.get_end(), fall_vec, buff=0.1).shift(UP*0.1))
        f_label = always_redraw(lambda: Text("f", color=PURPLE, font_size=24).next_to(f_arrow.get_end(), -fall_vec, buff=0.1).shift(UP*0.1))

        self.play(GrowArrow(mg_arrow), Write(mg_label))
        self.play(GrowArrow(n_arrow), Write(n_label))
        self.play(GrowArrow(parallel_mg_arrow), Write(parallel_mg_label))
        self.play(GrowArrow(f_arrow), Write(f_label))
        self.wait(1)

        # Movement tracker setup
        tracker = ValueTracker(0)

        # Updater to move and roll the ball cleanly
        def update_ball(b):
            val = tracker.get_value()
            center = ball_start_pos + fall_vec * val
            angle = -val / R
            
            b[0].move_to(center)
            b[1].become(Line(UP*R, DOWN*R, color=WHITE).move_to(center).rotate(angle))
            b[2].become(Line(LEFT*R, RIGHT*R, color=WHITE).move_to(center).rotate(angle))

        ball_group.add_updater(update_ball)

        ball_group.add_updater(update_ball)

        # Camera setup
        self.camera.frame.save_state()
        # Zoom in slightly on the ball to start
        self.play(self.camera.frame.animate.set(width=ball_group.width * 10).move_to(ball_group))
        
        # Make the camera track the ball
        self.camera.frame.add_updater(lambda frm: frm.move_to(ball_group.get_center()))

        # Animate ball sliding down by incrementing tracker value
        # The ball starts at 1.5 units down the incline, so the remaining distance to the vertex is L - 1.5
        dist = L - R - 1.5
        self.play(
            tracker.animate(rate_func=rate_functions.ease_in_quad).set_value(dist),
            run_time=3.5
        )
        
        # Stop tracking and zoom back out to see the whole scene at the end
        self.camera.frame.remove_updater(self.camera.frame.updaters[0])
        self.play(Restore(self.camera.frame))
        self.wait(2)
