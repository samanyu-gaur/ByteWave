from manim import *
import numpy as np

class WaveSound(Scene):
    def construct(self):
        # Base dimensions
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[-3, 3, 1],
            x_length=10,
            y_length=6,
            axis_config={"color": WHITE}
        )
        self.play(Create(axes))
        
        # Trackers for wave parameters
        A_tracker = ValueTracker(1.0)      # Amplitude
        f_tracker = ValueTracker(0.5)      # Frequency
        time_tracker = ValueTracker(0.0)   # TimeTracker
        
        v = 2.0                            # Wave speed (constant for a given medium)
        
        # We need wavelength (lam), wave number (k), and angular freq (omega) dynamically
        # v = f * lam -> lam = v / f
        # k = 2 * PI / lam = 2 * PI * f / v
        # omega = 2 * PI * f
        
        def get_y(x):
            A = A_tracker.get_value()
            f = f_tracker.get_value()
            t = time_tracker.get_value()
            
            lam = v / f
            k = 2 * PI / lam
            w_ang = 2 * PI * f
            
            return A * np.sin(k * x - w_ang * t)
            
        # Draw the dynamic wave
        wave = always_redraw(lambda: axes.plot(get_y, color=BLUE))
        
        # Display Math text
        eq_text = Text("y(x, t) = A sin(kx - ωt)", font_size=24).to_corner(DR).shift(UP * 1.5)
        
        # Display Dynamic Variables
        a_text = always_redraw(lambda: Text(
            f"Amplitude (A) = {A_tracker.get_value():.1f} m", font_size=16, color=YELLOW
        ).next_to(eq_text, DOWN, aligned_edge=RIGHT))
        
        f_text = always_redraw(lambda: Text(
            f"Frequency (f) = {f_tracker.get_value():.1f} Hz", font_size=16, color=RED
        ).next_to(a_text, DOWN, aligned_edge=RIGHT))
        
        # Speed is a constant in this medium
        v_text = always_redraw(lambda: Text(
            f"Speed (v) = {v:.1f} m/s", font_size=16, color=GREEN
        ).next_to(f_text, DOWN, aligned_edge=RIGHT))
        
        self.play(Write(eq_text), Write(a_text), Write(f_text), Write(v_text))
        self.play(Create(wave))
        self.wait(1)
        
        # --- Visualize Amplitude ---
        # Draw a double arrow from axis to the crest at a specific calculated x-coordinate
        def get_crest_x():
            # First crest is where phase (kx - wt) = PI/2 => x = (PI/2 + wt) / k
            f = f_tracker.get_value()
            t = time_tracker.get_value()
            w_ang = 2 * PI * f
            lam = v / f
            k = 2 * PI / lam
            
            x_crest = (PI/2 + w_ang * t) / k
            
            # Keep crest within screen bounds (modulo lambda)
            while x_crest > 10:
                x_crest -= lam
            while x_crest < 0:
                x_crest += lam
                
            return x_crest
            
        amp_arrow = always_redraw(lambda: DoubleArrow(
            start=axes.c2p(get_crest_x(), 0),
            end=axes.c2p(get_crest_x(), A_tracker.get_value()),
            color=YELLOW, buff=0, stroke_width=4, max_tip_length_to_length_ratio=0.15
        ))
        
        self.play(FadeIn(amp_arrow))
        
        # --- Phase: Traveling Wave (Wave Speed) ---
        # Draw a highlighted dot resting atop the crest to track its rightward speed
        crest_dot = always_redraw(lambda: Dot(axes.c2p(get_crest_x(), A_tracker.get_value()), color=GREEN))
        crest_velocity_arrow = always_redraw(lambda: Arrow(
            start=crest_dot.get_center(),
            end=crest_dot.get_center() + RIGHT * v * 0.5, # Length scales with v
            color=GREEN, buff=0.1, max_tip_length_to_length_ratio=0.3
        ))
        
        self.play(FadeIn(crest_dot), FadeIn(crest_velocity_arrow))
        
        # Let the time run! (Wave propogates right)
        self.play(
            time_tracker.animate.set_value(5.0),
            run_time=4.0,
            rate_func=linear
        )
        self.wait(1)
        
        self.play(FadeOut(amp_arrow), FadeOut(crest_dot), FadeOut(crest_velocity_arrow))
        
        # --- Phase: Increasing Amplitude (Louder Sound effect) ---
        amp_label = Text("Louder Sound = Increased Amplitude", font_size=28, color=YELLOW).to_edge(UP)
        self.play(Write(amp_label))
        
        # Parallel animation: Time keeps moving AND amplitude increases
        self.play(
            A_tracker.animate.set_value(2.5),
            time_tracker.animate.set_value(time_tracker.get_value() + 3.0),
            run_time=3.0,
            rate_func=linear
        )
        self.wait(1)
        self.play(FadeOut(amp_label))
        
        # --- Phase: Increasing Frequency (Higher Pitch effect) ---
        pitch_label = Text("Higher Pitch = Increased Frequency", font_size=28, color=RED).to_edge(UP)
        self.play(Write(pitch_label))
        
        # Parallel animation: Time keeps moving AND frequency increases (wave bunches up)
        self.play(
            f_tracker.animate.set_value(1.7),
            time_tracker.animate.set_value(time_tracker.get_value() + 5.0),
            run_time=5.0,
            rate_func=linear
        )
        self.wait(1)
        self.play(FadeOut(pitch_label))
        
        # Small wait at end
        self.play(
            time_tracker.animate.set_value(time_tracker.get_value() + 2.0),
            run_time=2.0,
            rate_func=linear
        )
