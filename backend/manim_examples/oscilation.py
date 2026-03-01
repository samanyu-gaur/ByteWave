from manim import *
import numpy as np

class SpringOscillation(Scene):
    def construct(self):
        # --- EASILY CONFIGURABLE PARAMETERS ---
        amplitude = 3.0       # Maximum displacement from equilibrium (A)
        spring_constant = 5.0 # Hooke's Law (k)
        mass = 2.0            # Mass of the block (m)
        run_duration = 10     # How long the simulation runs
        # --------------------------------------
        
        # Derived Physics Variables
        omega = np.sqrt(spring_constant / mass)  # Angular Frequency
        period = 2 * PI / omega
        
        # Base Scene Setup
        wall_x = -5
        equilibrium_x = 0
        ground_y = -1
        
        ground = Line([wall_x - 1, ground_y, 0], [5, ground_y, 0], color=GREEN)
        wall = Line([wall_x, ground_y, 0], [wall_x, 3, 0], color=WHITE)
        equilibrium_line = DashedLine([equilibrium_x, ground_y - 0.5, 0], [equilibrium_x, ground_y + 1.5, 0], color=GRAY)
        
        eq_label = Text("x = 0", font_size=20).next_to(equilibrium_line, DOWN)

        self.add(ground, wall, equilibrium_line, eq_label)
        
        # The Mass Block
        block = Square(side_length=1.0, color=BLUE, fill_opacity=0.8)
        
        # Time Tracker for kinematics
        time_tracker = ValueTracker(0)
        
        # The Physics Engine logic for position: x(t) = A * cos(w * t)
        def get_block_x(t):
            return equilibrium_x + amplitude * np.cos(omega * t)
            
        block.add_updater(lambda m: m.move_to([get_block_x(time_tracker.get_value()), ground_y + 0.5, 0]))
        
        # The Visual Spring
        # We draw a zigzag line representing the spring that connects the wall to the left edge of the block
        def create_spring():
            start = np.array([wall_x, ground_y + 0.5, 0])
            end = block.get_left()
            
            # Distance between wall and block
            dist = np.linalg.norm(end - start)
            
            # Number of coils 
            coils = 15
            
            # Generate local zigzag points, then scale and shift them
            points = []
            points.append(start)
            for i in range(1, coils * 2):
                x_ratio = i / (coils * 2)
                y_offset = 0.3 if i % 2 == 1 else -0.3
                point = start + (end - start) * x_ratio + UP * y_offset
                points.append(point)
            points.append(end)
            
            # Return a VGroup of lines
            lines = VGroup(*[Line(points[i], points[i+1], color=YELLOW) for i in range(len(points)-1)])
            return lines

        spring = always_redraw(create_spring)
        
        self.play(FadeIn(block), FadeIn(spring))
        self.wait(1)

        # --- Free Body Diagram Vectors ---
        scale_f = 0.3  # Scale force arrows down for visual aesthetics
        
        # Vertical Forces (Constant)
        gravity_arrow = always_redraw(lambda: Arrow(
            start=block.get_center(),
            end=block.get_center() + DOWN * mass * 9.8 * scale_f * 0.1,  # Scaled severely to fit on screen
            buff=0, color=ORANGE, max_tip_length_to_length_ratio=0.15
        ))
        g_label = always_redraw(lambda: Text("mg", font_size=20, color=ORANGE).next_to(gravity_arrow.get_end(), DOWN, buff=0.1))

        normal_arrow = always_redraw(lambda: Arrow(
            start=block.get_center() + DOWN * 0.5, # Start from bottom of block
            end=block.get_center() + DOWN * 0.5 + UP * 1.5,
            buff=0, color=PURPLE, max_tip_length_to_length_ratio=0.15
        ))
        n_label = always_redraw(lambda: Text("N", font_size=20, color=PURPLE).next_to(normal_arrow.get_end(), UP, buff=0.1))

        # Horizontal Restoring Force (F_s = -kx)
        # Force points opposite to displacement!
        def get_spring_force_vector():
            displacement = get_block_x(time_tracker.get_value()) - equilibrium_x
            force_magnitude = -spring_constant * displacement
            return RIGHT * force_magnitude * scale_f
            
        fs_arrow = always_redraw(lambda: Arrow(
            start=block.get_center(),
            end=block.get_center() + get_spring_force_vector() if abs(np.linalg.norm(get_spring_force_vector())) > 0.1 else block.get_center(),
            buff=0, color=RED
        ))
        
        def force_label_text():
            displacement = get_block_x(time_tracker.get_value()) - equilibrium_x
            f_val = -spring_constant * displacement
            # Hide completely if at equilibrium
            if abs(f_val) < 0.5:
                return Text("Fs = 0", font_size=20, color=RED).set_opacity(0)
            return Text(f"Fs = {f_val:.1f} N", font_size=20, color=RED)

        fs_label = always_redraw(lambda: force_label_text().next_to(
            fs_arrow.get_end() if abs(np.linalg.norm(get_spring_force_vector())) > 0.1 else block.get_center(), 
            UP, buff=0.1
        ))

        self.play(FadeIn(gravity_arrow), FadeIn(g_label), FadeIn(normal_arrow), FadeIn(n_label))
        self.play(FadeIn(fs_arrow), FadeIn(fs_label))
        self.wait(1)
        
        # --- Animation Playback ---
        
        # Displaying the math up top using Text (avoids LaTeX dependency errors)
        math_text = Text("x(t) = A cos(ωt)", font_size=24).to_corner(UR)
        omega_text = Text(f"ω = {omega:.2f} rad/s", font_size=24, color=YELLOW).next_to(math_text, DOWN, aligned_edge=RIGHT)
        
        self.play(Write(math_text), Write(omega_text))

        # Run the clock!
        self.play(
            time_tracker.animate(rate_func=linear).set_value(run_duration),
            run_time=run_duration
        )
        
        self.wait(1)
