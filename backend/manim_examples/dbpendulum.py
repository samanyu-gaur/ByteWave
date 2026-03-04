from manim import *
import numpy as np
from scipy.integrate import odeint
from scipy.interpolate import interp1d

class DoublePendulum(Scene):
    def construct(self):
        # Physical parameters
        g = 9.8
        m1 = 2.0
        m2 = 1.5
        L1 = 2.0
        L2 = 1.5
        
        # Initial state: angles (from vertical) and angular velocities
        th1_0 = 120 * DEGREES
        w1_0 = 0.0
        th2_0 = 100 * DEGREES
        w2_0 = 0.0
        state0 = [th1_0, w1_0, th2_0, w2_0]
        
        # Time array for ODE solver
        t_max = 10.0
        fps = 60
        t = np.linspace(0, t_max, int(t_max * fps))
        
        # Derivatives for double pendulum
        def derivs(state, t):
            th1, w1, th2, w2 = state
            delta = th1 - th2
            den1 = L1 * (2*m1 + m2 - m2 * np.cos(2*th1 - 2*th2))
            num1 = -g * (2*m1 + m2) * np.sin(th1) - m2 * g * np.sin(th1 - 2*th2) \
                   - 2 * np.sin(delta) * m2 * (w2**2 * L2 + w1**2 * L1 * np.cos(delta))
            dw1 = num1 / den1
            
            den2 = L2 * (2*m1 + m2 - m2 * np.cos(2*th1 - 2*th2))
            num2 = 2 * np.sin(delta) * (w1**2 * L1 * (m1 + m2) + g * (m1 + m2) * np.cos(th1) \
                   + w2**2 * L2 * m2 * np.cos(delta))
            dw2 = num2 / den2
            
            return [w1, dw1, w2, dw2]

        # Solve ODE mathematically using scipy!
        sol = odeint(derivs, state0, t)
        
        # Interpolate the solution so Manim can request the angle smoothly at any micro-second
        th1_interp = interp1d(t, sol[:, 0])
        th2_interp = interp1d(t, sol[:, 2])
        
        # Scene Elements setup
        pivot = UP * 2
        t_tracker = ValueTracker(0)
        
        def get_p1():
            th1 = th1_interp(t_tracker.get_value())
            return pivot + np.array([L1 * np.sin(th1), -L1 * np.cos(th1), 0])
            
        def get_p2():
            th2 = th2_interp(t_tracker.get_value())
            return get_p1() + np.array([L2 * np.sin(th2), -L2 * np.cos(th2), 0])
            
        # Static and moving hardware
        ceiling = Line(LEFT * 2, RIGHT * 2, color=GRAY).shift(UP * 2)
        pivot_dot = Dot(color=WHITE).move_to(pivot)
        
        rod1 = always_redraw(lambda: Line(pivot, get_p1(), color=WHITE, stroke_width=4))
        rod2 = always_redraw(lambda: Line(get_p1(), get_p2(), color=WHITE, stroke_width=4))
        
        mass1 = always_redraw(lambda: Circle(radius=0.1 * m1, color=BLUE, fill_opacity=0.8).move_to(get_p1()))
        mass2 = always_redraw(lambda: Circle(radius=0.1 * m2, color=RED, fill_opacity=0.8).move_to(get_p2()))
        
        # Add a trail so we can see the sheer chaos
        path = TracedPath(mass2.get_center, stroke_width=3, stroke_color=YELLOW, dissipating_time=1.0)
        
        self.add(ceiling, pivot_dot, rod1, rod2, mass1, mass2, path)
        
        # --- Free Body Diagram Vectors ---
        # Gravity vectors
        w1_arrow = always_redraw(lambda: Arrow(
            start=get_p1(), end=get_p1() + DOWN * m1 * 0.5,
            buff=0, color=ORANGE, stroke_width=3, max_tip_length_to_length_ratio=0.2
        ))
        w2_arrow = always_redraw(lambda: Arrow(
            start=get_p2(), end=get_p2() + DOWN * m2 * 0.5,
            buff=0, color=ORANGE, stroke_width=3, max_tip_length_to_length_ratio=0.2
        ))
        
        # Tension strings continuously pull towards the connection points.
        # Lengths are standardized visually since exact ODE tension involves massive second-derivatives
        t1_len = m1 * 0.6 
        t2_len = m2 * 0.6
        
        def get_t1_dir():
            d = pivot - get_p1()
            return d / (np.linalg.norm(d) + 1e-6)
            
        T1_arrow = always_redraw(lambda: Arrow(
            start=get_p1(), end=get_p1() + get_t1_dir() * t1_len,
            buff=0, color=GREEN, stroke_width=3, max_tip_length_to_length_ratio=0.2
        ))
        
        def get_t2_dir_m2():
            d = get_p1() - get_p2()
            return d / (np.linalg.norm(d) + 1e-6)
            
        T2_arrow_m2 = always_redraw(lambda: Arrow(
            start=get_p2(), end=get_p2() + get_t2_dir_m2() * t2_len,
            buff=0, color=GREEN, stroke_width=3, max_tip_length_to_length_ratio=0.2
        ))
        
        T2_arrow_m1 = always_redraw(lambda: Arrow(
            start=get_p1(), end=get_p1() - get_t2_dir_m2() * t2_len,
            buff=0, color=GREEN, stroke_width=3, max_tip_length_to_length_ratio=0.2
        ))

        # Vector Labels
        w1_text = always_redraw(lambda: Text("m1 g", font_size=16, color=ORANGE).next_to(w1_arrow.get_end(), DOWN, buff=0.1))
        w2_text = always_redraw(lambda: Text("m2 g", font_size=16, color=ORANGE).next_to(w2_arrow.get_end(), DOWN, buff=0.1))
        T1_text = always_redraw(lambda: Text("T1", font_size=16, color=GREEN).next_to(T1_arrow.get_end(), get_t1_dir(), buff=0.1))
        T2_m2_text = always_redraw(lambda: Text("T2", font_size=16, color=GREEN).next_to(T2_arrow_m2.get_end(), get_t2_dir_m2(), buff=0.1))
        T2_m1_text = always_redraw(lambda: Text("T2", font_size=16, color=GREEN).next_to(T2_arrow_m1.get_end(), -get_t2_dir_m2(), buff=0.1))

        self.add(w1_arrow, w2_arrow, T1_arrow, T2_arrow_m1, T2_arrow_m2)
        self.add(w1_text, w2_text, T1_text, T2_m1_text, T2_m2_text)
        
        # Play the animation mathematically exactly along the ODE solution 
        self.play(
            t_tracker.animate(rate_func=linear).set_value(t_max - 0.1),
            run_time=t_max - 0.1
        )
        self.wait(1)
