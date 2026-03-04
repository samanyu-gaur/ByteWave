from manim import *
import numpy as np

class EnergyPendulum(Scene):
    def construct(self):
        # --- EASILY CONFIGURABLE PARAMETERS ---
        L = 3.0                      # Length of string (m)
        g = 9.8                      # Gravity (m/s^2)
        mass = 5.0                   # Mass of the pendulum bob (kg)
        theta_0 = 45 * DEGREES       # Maximum release angle
        # --------------------------------------
        
        # Derived Variables
        omega = np.sqrt(g / L)       # Angular frequency
        period = 2 * PI / omega
        
        # Max Energy Calculate (using standard height relative to lowest point)
        h_max = L - L * np.cos(theta_0)
        E_total = mass * g * h_max   # Ep + Ek is always this constant value!
        
        # --- Scene Setup ---
        pivot = np.array([-3, 2, 0])
        ceiling = Line(pivot + LEFT*1.5, pivot + RIGHT*1.5, color=WHITE)
        
        # Tracker for the angle time progression
        time_tracker = ValueTracker(0)
        
        def get_theta(t):
            # For small angles, theta(t) = theta0 * cos(wt), but 45 is largeish. 
            # We use SHM approximation here for visual smoothness:
            return theta_0 * np.cos(omega * t)
            
        def get_omega_velocity(t):
            # Derivative of get_theta
            return -theta_0 * omega * np.sin(omega * t)
            
        def get_bob_pos(t):
            theta = get_theta(t)
            x = pivot[0] + L * np.sin(theta)
            y = pivot[1] - L * np.cos(theta)
            return np.array([x, y, 0])
            
        # Draw the String and Bob
        string = always_redraw(lambda: Line(pivot, get_bob_pos(time_tracker.get_value()), color=WHITE))
        bob = always_redraw(lambda: Circle(radius=0.3, color=BLUE, fill_opacity=1).move_to(get_bob_pos(time_tracker.get_value())))
        
        self.add(ceiling, string, bob)
        
        # Lowest Point line
        lowest_y = pivot[1] - L
        lowest_line = DashedLine([pivot[0] - 2, lowest_y, 0], [pivot[0] + 2, lowest_y, 0], color=GREEN)
        lowest_text = Text("h = 0 m", font_size=16, color=GREEN).next_to(lowest_line, RIGHT)
        self.add(lowest_line, lowest_text)
        
        # --- Energy Logic ---
        
        # Given height relative to lowest point: h(theta) = L - L*cos(theta)
        def get_height(t):
            theta = get_theta(t)
            return L - L * np.cos(theta)
            
        def get_Ep(t):
            return mass * g * get_height(t)
            
        def get_Ek(t):
            # Ek = Total Energy - Ep (satisfies conservation exactly regardless of large angle approx)
            return E_total - get_Ep(t)
            
        # --- On-Screen Real-time Metrics ---
        metrics_x = 2
        
        title_text = Text("Conservation of Energy", font_size=32).to_corner(UR)
        
        ep_text = always_redraw(lambda: Text(
            f"Ep = {get_Ep(time_tracker.get_value()):.1f} J", 
            font_size=24, color=BLUE
        ).move_to([metrics_x, 2, 0], aligned_edge=LEFT))
        
        ek_text = always_redraw(lambda: Text(
            f"Ek = {get_Ek(time_tracker.get_value()):.1f} J", 
            font_size=24, color=RED
        ).next_to(ep_text, DOWN, aligned_edge=LEFT))
        
        et_text = Text(f"Total = {E_total:.1f} J", font_size=24, color=YELLOW).next_to(ek_text, DOWN, aligned_edge=LEFT, buff=0.4)
        
        self.add(title_text, ep_text, ek_text, et_text)
        
        # --- Dynamic Bar Charts ---
        bar_bottom = ek_text.get_bottom()[1] - 1
        
        # Scale factor for bars
        scale_b = 2.0 / E_total
        
        ep_bar_outline = Rectangle(width=0.8, height=2.0, color=WHITE).move_to([metrics_x + 0.5, bar_bottom - 1, 0])
        ek_bar_outline = Rectangle(width=0.8, height=2.0, color=WHITE).next_to(ep_bar_outline, RIGHT, buff=0.5)
        
        ep_label = Text("Ep", font_size=20).next_to(ep_bar_outline, DOWN)
        ek_label = Text("Ek", font_size=20).next_to(ek_bar_outline, DOWN)
        
        ep_bar = always_redraw(lambda: Rectangle(
            width=0.8, 
            height=get_Ep(time_tracker.get_value()) * scale_b + 0.001, # Avoid height zero
            color=BLUE, fill_opacity=0.8
        ).move_to(ep_bar_outline.get_bottom(), aligned_edge=DOWN))
        
        ek_bar = always_redraw(lambda: Rectangle(
            width=0.8, 
            height=get_Ek(time_tracker.get_value()) * scale_b + 0.001, 
            color=RED, fill_opacity=0.8
        ).move_to(ek_bar_outline.get_bottom(), aligned_edge=DOWN))
        
        self.add(ep_bar_outline, ek_bar_outline, ep_label, ek_label, ep_bar, ek_bar)
        
        self.wait(1)
        
        # --- Focus 1: Ep MAX, Ek ZERO (Top of swing) ---
        
        t1 = Text("Max Height (h = Max)", font_size=24, color=BLUE).next_to(et_text, DOWN, buff=1.0)
        t2 = Text("Velocity = 0 m/s", font_size=24, color=RED).next_to(t1, DOWN)
        self.play(Write(t1), Write(t2))
        
        self.wait(3)
        self.play(FadeOut(t1), FadeOut(t2))
        
        # --- Swing Down ---
        self.play(
            time_tracker.animate(rate_func=linear).set_value(period / 4), # Fall exactly to equilibrium
            run_time=1.5
        )
        
        # --- Focus 2: Ep ZERO, Ek MAX (Bottom of swing) ---
        t3 = Text("Lowest Point (h = 0 m)", font_size=24, color=BLUE).next_to(et_text, DOWN, buff=1.0)
        t4 = Text("Velocity = Max", font_size=24, color=RED).next_to(t3, DOWN)
        self.play(Write(t3), Write(t4))
        
        self.wait(3)
        self.play(FadeOut(t3), FadeOut(t4))
        
        # --- Finish the Cycle ---
        self.play(
            time_tracker.animate(rate_func=linear).set_value(period),
            run_time=period - (period/4)  # the remainder of the time
        )
        self.wait(1)
