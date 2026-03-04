"""
Curated physics examples for the RAG knowledge base.

Each entry has:
  - topic: short identifier
  - description: physics explanation + what to animate
  - manim_code: proven working construct() body (4-space indented, no class/imports)
  - visual_rules: color/style conventions for this topic
"""

PHYSICS_EXAMPLES = [

    # ------------------------------------------------------------------ MECHANICS
    {
        "topic": "simple_pendulum",
        "description": (
            "A simple pendulum consists of a mass (bob) on a string pivoting from a fixed point. "
            "Forces acting on the bob are gravity (mg, downward, RED) and string tension (T, along rod toward pivot, GREEN). "
            "The net tangential force mg*sin(theta) provides restoring motion. "
            "Animate the rod swinging left and right, showing force arrows that move with the bob, "
            "an angle arc theta from the vertical, and the equation T - mg*cos(theta) = mv^2/L."
        ),
        "visual_rules": (
            "Pivot: white dot at top. Rod: BLUE line. Bob: YELLOW filled circle. "
            "Gravity arrow: RED pointing down from bob, label 'mg'. "
            "Tension arrow: GREEN pointing from bob toward pivot, label 'T'. "
            "Angle arc: ORANGE. Equation: WHITE Text at bottom."
        ),
        "manim_code": """\
        title = Text("Simple Pendulum", font_size=34).to_edge(UP)
        pivot = Dot(UP * 2.5, color=WHITE)
        pivot_label = Text("Pivot", font_size=18).next_to(pivot, UP, buff=0.15)
        theta = ValueTracker(0.8)
        L = 2.8

        rod = always_redraw(lambda: Line(
            pivot.get_center(),
            pivot.get_center() + L * (DOWN * np.cos(theta.get_value()) + RIGHT * np.sin(theta.get_value())),
            color=BLUE, stroke_width=4
        ))
        bob = always_redraw(lambda: Circle(radius=0.22, color=YELLOW, fill_opacity=0.9).move_to(rod.get_end()))
        mg_arrow = always_redraw(lambda: Arrow(rod.get_end(), rod.get_end() + DOWN * 0.9,
            color=RED, buff=0, stroke_width=3, max_tip_length_to_length_ratio=0.25))
        mg_label = MathTex(r"mg", font_size=30, color=RED).to_corner(DR).shift(UP*1.5)
        t_dir = always_redraw(lambda: (pivot.get_center() - rod.get_end()) /
            np.linalg.norm(pivot.get_center() - rod.get_end() + 1e-9))
        t_arrow = always_redraw(lambda: Arrow(rod.get_end(), rod.get_end() + t_dir.get_value() * 0.9,
            color=GREEN, buff=0, stroke_width=3, max_tip_length_to_length_ratio=0.25))
        t_label = MathTex(r"T", font_size=30, color=GREEN).to_corner(DL).shift(UP*1.5)
        angle_arc = always_redraw(lambda: Arc(radius=0.65, start_angle=-PI/2,
            angle=theta.get_value(), arc_center=pivot.get_center(), color=ORANGE))
        angle_label = MathTex(r"\theta", font_size=30, color=ORANGE).move_to(
            pivot.get_center() + DOWN*0.5 + RIGHT*0.5)
        eq = MathTex(r"T - mg\cos\theta = \frac{mv^2}{L}", font_size=30, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(pivot), Write(pivot_label))
        self.add(rod, bob, mg_arrow)
        self.play(Write(mg_label), Create(t_arrow), Write(t_label))
        self.add(angle_arc)
        self.play(Write(angle_label))
        self.play(Write(eq))
        self.play(theta.animate.set_value(-0.8), run_time=1.2)
        self.play(theta.animate.set_value(0.8), run_time=1.2)
        self.play(theta.animate.set_value(-0.5), run_time=1.0)
        self.play(theta.animate.set_value(0.5), run_time=1.0)
        self.play(theta.animate.set_value(0), run_time=0.8)
        self.wait(1)""",
    },

    {
        "topic": "projectile_motion",
        "description": (
            "Projectile motion: an object launched at angle theta with initial velocity v0 follows a parabolic path. "
            "Horizontal velocity vx = v0*cos(theta) is constant (no air resistance). "
            "Vertical velocity vy = v0*sin(theta) - g*t decreases due to gravity. "
            "Animate the trajectory path, a moving dot, velocity component arrows at launch, "
            "gravity arrow pointing down, and the kinematic equations."
        ),
        "visual_rules": (
            "Axes: white. Trajectory path: YELLOW dashed. Moving dot: RED. "
            "Horizontal velocity arrow: GREEN, label 'vx'. Vertical velocity arrow: BLUE, label 'vy'. "
            "Gravity arrow: RED pointing down, label 'g'. Equations: WHITE."
        ),
        "manim_code": """\
        title = Text("Projectile Motion", font_size=34).to_edge(UP)
        axes = Axes(x_range=[0, 7, 1], y_range=[0, 4, 1], x_length=9, y_length=4,
                    axis_config={"color": WHITE}).shift(DOWN * 0.5)
        x_label = MathTex(r"x", font_size=36).next_to(axes.x_axis, RIGHT)
        y_label = MathTex(r"y", font_size=36).next_to(axes.y_axis, UP)

        v0, angle = 7, 0.6
        g = 9.8
        vx = v0 * np.cos(angle)
        vy_init = v0 * np.sin(angle)
        t_max = 2 * vy_init / g

        path = axes.plot(lambda x: x * np.tan(angle) - (g / (2 * vx**2)) * x**2,
                         x_range=[0, vx * t_max], color=YELLOW)
        dot = Dot(color=RED).move_to(axes.c2p(0, 0))

        launch_pt = axes.c2p(0, 0)
        vx_arrow = Arrow(launch_pt, launch_pt + RIGHT * 1.5, color=GREEN, buff=0)
        vx_label = MathTex(r"v_x", font_size=28, color=GREEN).next_to(vx_arrow, DOWN, buff=0.1)
        vy_arrow = Arrow(launch_pt, launch_pt + UP * 1.2, color=BLUE, buff=0)
        vy_label = MathTex(r"v_y", font_size=28, color=BLUE).next_to(vy_arrow, LEFT, buff=0.1)
        g_arrow = Arrow(launch_pt + RIGHT * 3 + UP * 1.5, launch_pt + RIGHT * 3 + UP * 0.3,
                        color=RED, buff=0)
        g_label = MathTex(r"g", font_size=28, color=RED).next_to(g_arrow, RIGHT, buff=0.1)

        eq1 = MathTex(r"x = v_0\cos\theta\cdot t", font_size=26, color=WHITE).to_corner(UR).shift(DOWN * 0.5)
        eq2 = MathTex(r"y = v_0\sin\theta\cdot t - \frac{1}{2}gt^2", font_size=26, color=WHITE).next_to(eq1, DOWN)

        self.play(Write(title))
        self.play(Create(axes), Write(x_label), Write(y_label))
        self.play(Create(vx_arrow), Write(vx_label), Create(vy_arrow), Write(vy_label))
        self.play(FadeIn(g_arrow), Write(g_label))
        self.play(Write(eq1), Write(eq2))
        self.play(Create(path), run_time=2)
        self.play(MoveAlongPath(dot, path), run_time=3, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "newtons_second_law_block",
        "description": (
            "Newton's second law: F_net = ma. A block on a surface experiences applied force F, "
            "friction force f opposing motion, normal force N upward, and gravity mg downward. "
            "Net horizontal force accelerates the block: F - f = ma. "
            "Show a free body diagram with labeled force arrows, then animate the block sliding."
        ),
        "visual_rules": (
            "Block: BLUE rectangle, label 'm'. Ground: GREY line. "
            "Applied force arrow: YELLOW, label 'F'. Friction: RED pointing left, label 'f'. "
            "Normal: GREEN pointing up, label 'N'. Gravity: RED pointing down, label 'mg'. "
            "Equation: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Newton's Second Law: F = ma", font_size=32).to_edge(UP)
        ground = Line(LEFT*5.5 + DOWN*1.8, RIGHT*5.5 + DOWN*1.8, color=GREY, stroke_width=3)
        block = Rectangle(width=1.6, height=0.9, color=BLUE, fill_opacity=0.6).move_to(LEFT*2.5 + DOWN*1.35)
        m_label = MathTex(r"m", font_size=28, color=WHITE).move_to(block.get_center())

        f_arrow = Arrow(block.get_right(), block.get_right() + RIGHT*2, color=YELLOW, buff=0)
        f_label = MathTex(r"F", font_size=28, color=YELLOW).next_to(f_arrow, UP, buff=0.1)
        fr_arrow = Arrow(block.get_left(), block.get_left() + LEFT*1.1, color=RED, buff=0)
        fr_label = MathTex(r"f", font_size=28, color=RED).next_to(fr_arrow, UP, buff=0.1)
        n_arrow = Arrow(block.get_top(), block.get_top() + UP*1.1, color=GREEN, buff=0)
        n_label = MathTex(r"N", font_size=28, color=GREEN).next_to(n_arrow, RIGHT, buff=0.1)
        mg_arrow = Arrow(block.get_bottom(), block.get_bottom() + DOWN*1.1, color=RED, buff=0)
        mg_label = MathTex(r"mg", font_size=28, color=RED).next_to(mg_arrow, RIGHT, buff=0.1)
        eq = MathTex(r"F_{net} = F - f = ma", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(ground), FadeIn(block), Write(m_label))
        self.play(Create(n_arrow), Write(n_label), Create(mg_arrow), Write(mg_label))
        self.play(Create(f_arrow), Write(f_label), Create(fr_arrow), Write(fr_label))
        self.play(Write(eq))
        self.wait(0.5)
        self.play(
            block.animate.shift(RIGHT*3.5),
            f_arrow.animate.shift(RIGHT*3.5), f_label.animate.shift(RIGHT*3.5),
            fr_arrow.animate.shift(RIGHT*3.5), fr_label.animate.shift(RIGHT*3.5),
            n_arrow.animate.shift(RIGHT*3.5), n_label.animate.shift(RIGHT*3.5),
            mg_arrow.animate.shift(RIGHT*3.5), mg_label.animate.shift(RIGHT*3.5),
            m_label.animate.shift(RIGHT*3.5),
            run_time=2.5, rate_func=linear
        )
        self.wait(1)""",
    },

    {
        "topic": "inclined_plane",
        "description": (
            "A block resting on a frictionless inclined plane at angle theta. "
            "Forces: gravity mg (downward, decomposed into parallel mg*sin(theta) and perpendicular mg*cos(theta)), "
            "normal force N (perpendicular to surface, GREEN). "
            "If no friction, the block accelerates down the slope: a = g*sin(theta). "
            "Show the incline, block, all force components with labeled arrows."
        ),
        "visual_rules": (
            "Incline surface: WHITE line. Block: BLUE square on slope. "
            "mg downward: RED arrow, label 'mg'. mg parallel: ORANGE arrow along slope, label 'mg sin(theta)'. "
            "mg perpendicular: YELLOW arrow into slope, label 'mg cos(theta)'. "
            "Normal N: GREEN arrow perpendicular out of slope, label 'N'. Angle: WHITE arc, label 'theta'."
        ),
        "manim_code": """\
        title = Text("Inclined Plane Forces", font_size=34).to_edge(UP)
        theta_val = 30 * DEGREES
        L = 5.0
        incline_start = LEFT*3 + DOWN*1.5
        incline_end = incline_start + L * (RIGHT*np.cos(theta_val) + UP*np.sin(theta_val))

        incline = Line(incline_start, incline_end, color=WHITE, stroke_width=3)
        base = Line(incline_start, incline_start + RIGHT*L, color=GREY)
        vert = Line(incline_start + RIGHT*L, incline_end, color=GREY)

        block_pos = incline_start + (L*0.55) * (RIGHT*np.cos(theta_val) + UP*np.sin(theta_val))
        block = Square(side_length=0.6, color=BLUE, fill_opacity=0.7).move_to(block_pos)
        block.rotate(theta_val)

        perp_dir = np.array([-np.sin(theta_val), np.cos(theta_val), 0])
        para_dir = np.array([np.cos(theta_val), np.sin(theta_val), 0])

        mg_arrow = Arrow(block_pos, block_pos + DOWN*1.5, color=RED, buff=0)
        mg_label = MathTex(r"mg", font_size=28, color=RED).next_to(mg_arrow.get_end(), RIGHT, buff=0.1)
        n_arrow = Arrow(block_pos, block_pos + perp_dir*1.2, color=GREEN, buff=0)
        n_label = MathTex(r"N", font_size=28, color=GREEN).next_to(n_arrow.get_end(), UL, buff=0.1)
        para_arrow = Arrow(block_pos, block_pos - para_dir*1.0, color=ORANGE, buff=0)
        para_label = MathTex(r"mg\sin\theta", font_size=24, color=ORANGE).next_to(para_arrow.get_end(), DOWN, buff=0.1)
        perp_arrow = Arrow(block_pos, block_pos - perp_dir*0.8, color=YELLOW, buff=0)
        perp_label = MathTex(r"mg\cos\theta", font_size=24, color=YELLOW).next_to(perp_arrow.get_end(), RIGHT, buff=0.1)

        angle_arc = Arc(radius=0.6, start_angle=0, angle=theta_val, arc_center=incline_start, color=WHITE)
        angle_label = MathTex(r"\theta", font_size=28, color=WHITE).move_to(incline_start + RIGHT*0.85 + UP*0.2)
        eq = MathTex(r"a = g\sin\theta", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(incline), Create(base), Create(vert), FadeIn(block))
        self.play(Create(angle_arc), Write(angle_label))
        self.play(Create(mg_arrow), Write(mg_label))
        self.play(Create(n_arrow), Write(n_label))
        self.play(Create(para_arrow), Write(para_label), Create(perp_arrow), Write(perp_label))
        self.play(Write(eq))
        self.wait(2)""",
    },

    {
        "topic": "circular_motion",
        "description": (
            "Uniform circular motion: an object moves at constant speed in a circle. "
            "Centripetal acceleration a = v^2/r always points toward the center. "
            "Centripetal force F = mv^2/r is provided by tension, gravity, or normal force. "
            "Velocity is always tangent to the circle. "
            "Animate an object orbiting, with centripetal force arrow always pointing inward "
            "and velocity arrow always tangent."
        ),
        "visual_rules": (
            "Circle path: WHITE dashed. Object: YELLOW dot. "
            "Centripetal force arrow: RED pointing to center, label 'F_c'. "
            "Velocity arrow: GREEN tangent to circle, label 'v'. "
            "Center: WHITE dot, label 'center'. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Uniform Circular Motion", font_size=34).to_edge(UP)
        center = ORIGIN + DOWN*0.3
        radius = 2.0
        circle = DashedVMobject(Circle(radius=radius, color=WHITE).move_to(center), num_dashes=30)
        center_dot = Dot(center, color=WHITE)
        center_label = Text("center", font_size=18).next_to(center_dot, DOWN, buff=0.15)

        angle = ValueTracker(0)
        obj = always_redraw(lambda: Dot(
            center + radius * (RIGHT*np.cos(angle.get_value()) + UP*np.sin(angle.get_value())),
            color=YELLOW, radius=0.15))
        fc_arrow = always_redraw(lambda: Arrow(
            obj.get_center(),
            center,
            color=RED, buff=0.15, stroke_width=3, max_tip_length_to_length_ratio=0.25))
        fc_label = MathTex(r"F_c", font_size=28, color=RED).to_corner(DR).shift(UP*0.5)
        tan_dir = always_redraw(lambda: np.array([
            -np.sin(angle.get_value()), np.cos(angle.get_value()), 0]))
        v_arrow = always_redraw(lambda: Arrow(
            obj.get_center(),
            obj.get_center() + tan_dir.get_value() * 0.9,
            color=GREEN, buff=0, stroke_width=3, max_tip_length_to_length_ratio=0.25))
        v_label = MathTex(r"v", font_size=28, color=GREEN).to_corner(DL).shift(UP*0.5)

        eq = MathTex(r"F_c = \frac{mv^2}{r}, \quad a_c = \frac{v^2}{r}", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(circle), FadeIn(center_dot), Write(center_label))
        self.add(obj, fc_arrow, fc_label, v_arrow, v_label)
        self.play(Write(eq))
        self.play(angle.animate.set_value(2*PI), run_time=4, rate_func=linear)
        self.play(angle.animate.set_value(4*PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "spring_mass_oscillation",
        "description": (
            "A mass on a spring undergoes simple harmonic motion. "
            "Restoring force F = -kx (Hooke's law, BLUE arrow) opposes displacement from equilibrium. "
            "Period T = 2*pi*sqrt(m/k). Acceleration a = -kx/m. "
            "Animate the mass oscillating left and right, showing the spring compression/extension, "
            "force arrow that changes direction with displacement, and x(t) equation."
        ),
        "visual_rules": (
            "Wall: GREY vertical line. Spring: YELLOW zigzag (use Line segments). "
            "Mass block: BLUE rectangle. Equilibrium line: WHITE dashed vertical. "
            "Force arrow: RED pointing toward equilibrium, label 'F = -kx'. "
            "Displacement: GREEN double arrow, label 'x'. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Spring-Mass Oscillation (SHM)", font_size=32).to_edge(UP)
        wall = Line(LEFT*5.5 + DOWN*0.8, LEFT*5.5 + UP*0.8, color=GREY, stroke_width=6)
        equil = DashedLine(LEFT*0.5 + DOWN*1.2, LEFT*0.5 + UP*1.2, color=WHITE, dash_length=0.15)
        equil_label = Text("equilibrium", font_size=16, color=WHITE).next_to(equil, UP, buff=0.1)

        x = ValueTracker(2.0)

        def make_spring(x_val):
            start = np.array([-5.5, 0, 0])
            end = np.array([x_val - 0.8, 0, 0])
            n_coils = 10
            pts = [start]
            length = end[0] - start[0]
            for i in range(1, n_coils + 1):
                frac = i / n_coils
                px = start[0] + frac * length
                py = 0.2 * (1 if i % 2 == 0 else -1)
                pts.append(np.array([px, py, 0]))
            pts.append(end)
            return VMobject(color=YELLOW).set_points_as_corners(pts)

        spring = always_redraw(lambda: make_spring(x.get_value()))
        mass = always_redraw(lambda: Rectangle(width=1.0, height=0.8, color=BLUE, fill_opacity=0.7)
                             .move_to(np.array([x.get_value(), 0, 0])))
        force_arrow = always_redraw(lambda: Arrow(
            np.array([x.get_value(), 0, 0]),
            np.array([x.get_value() - 0.8 * np.sign(x.get_value() - (-0.5)), 0, 0]) if abs(x.get_value() - (-0.5)) > 0.1
            else np.array([x.get_value(), 0, 0]),
            color=RED, buff=0.5, stroke_width=3))
        force_label = MathTex(r"F = -kx", font_size=26, color=RED).to_corner(UR).shift(DOWN*0.5)
        eq = MathTex(r"x(t) = A\cos(\omega t), \quad T = 2\pi\sqrt{\frac{m}{k}}", font_size=26, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(wall), Create(equil), Write(equil_label))
        self.add(spring, mass, force_arrow, force_label)
        self.play(Write(eq))
        self.play(x.animate.set_value(-2.0), run_time=2, rate_func=there_and_back)
        self.play(x.animate.set_value(-2.0), run_time=2)
        self.play(x.animate.set_value(2.0), run_time=2, rate_func=there_and_back)
        self.wait(1)""",
    },

    {
        "topic": "elastic_collision",
        "description": (
            "Elastic collision: two objects collide and both momentum and kinetic energy are conserved. "
            "m1*v1i + m2*v2i = m1*v1f + m2*v2f (momentum). "
            "Show two balls approaching each other, colliding, and bouncing apart. "
            "Label masses, initial/final velocities with arrows."
        ),
        "visual_rules": (
            "Ball 1: BLUE circle, label 'm1'. Ball 2: RED circle, label 'm2'. "
            "Velocity arrows: GREEN, pointing in direction of motion, labeled 'v1' and 'v2'. "
            "Before/after labels: WHITE. Conservation equations: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Elastic Collision", font_size=34).to_edge(UP)
        ground = Line(LEFT*6 + DOWN*1.5, RIGHT*6 + DOWN*1.5, color=GREY)

        ball1 = Circle(radius=0.4, color=BLUE, fill_opacity=0.8).move_to(LEFT*4 + DOWN*1.1)
        label1 = MathTex(r"m_1", font_size=28, color=WHITE).move_to(ball1.get_center())
        ball2 = Circle(radius=0.4, color=RED, fill_opacity=0.8).move_to(RIGHT*4 + DOWN*1.1)
        label2 = MathTex(r"m_2", font_size=28, color=WHITE).move_to(ball2.get_center())

        v1_arrow = Arrow(ball1.get_center() + LEFT*0.4, ball1.get_center() + RIGHT*0.8, color=GREEN, buff=0)
        v1_label = MathTex(r"v_1", font_size=26, color=GREEN).next_to(v1_arrow, UP, buff=0.1)
        v2_arrow = Arrow(ball2.get_center() + RIGHT*0.4, ball2.get_center() + LEFT*0.8, color=GREEN, buff=0)
        v2_label = MathTex(r"v_2", font_size=26, color=GREEN).next_to(v2_arrow, UP, buff=0.1)

        eq1 = MathTex(r"m_1v_1 + m_2v_2 = \text{const (momentum)}", font_size=24, color=WHITE).to_edge(DOWN).shift(UP*0.4)
        eq2 = MathTex(r"KE_1 + KE_2 = \text{const (energy)}", font_size=24, color=WHITE).next_to(eq1, DOWN)

        self.play(Write(title), Create(ground))
        self.play(FadeIn(ball1), Write(label1), FadeIn(ball2), Write(label2))
        self.play(Create(v1_arrow), Write(v1_label), Create(v2_arrow), Write(v2_label))
        self.play(Write(eq1), Write(eq2))
        self.play(
            ball1.animate.shift(RIGHT*3.6), label1.animate.shift(RIGHT*3.6),
            v1_arrow.animate.shift(RIGHT*3.6), v1_label.animate.shift(RIGHT*3.6),
            ball2.animate.shift(LEFT*3.6), label2.animate.shift(LEFT*3.6),
            v2_arrow.animate.shift(LEFT*3.6), v2_label.animate.shift(LEFT*3.6),
            run_time=2, rate_func=linear
        )
        self.play(
            ball1.animate.shift(LEFT*2.5), label1.animate.shift(LEFT*2.5),
            ball2.animate.shift(RIGHT*2.5), label2.animate.shift(RIGHT*2.5),
            run_time=1.5, rate_func=linear
        )
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ WAVES
    {
        "topic": "transverse_wave",
        "description": (
            "A transverse wave has oscillations perpendicular to propagation direction. "
            "y(x,t) = A*sin(kx - wt). Wavelength lambda = 2*pi/k, Period T = 2*pi/w, speed v = lambda/T. "
            "Animate a sine wave moving to the right, label wavelength, amplitude, direction of propagation."
        ),
        "visual_rules": (
            "Wave: BLUE sinusoid. Amplitude arrows: YELLOW double-headed vertical, label 'A'. "
            "Wavelength bracket: GREEN horizontal, label 'lambda'. "
            "Propagation arrow: WHITE pointing right, label 'v'. Equation: WHITE at top."
        ),
        "manim_code": """\
        title = Text("Transverse Wave", font_size=34).to_edge(UP)
        axes = Axes(x_range=[0, 8, 1], y_range=[-2, 2, 1], x_length=9, y_length=3.5,
                    axis_config={"color": WHITE}).shift(DOWN*0.3)
        phase = ValueTracker(0)
        wave = always_redraw(lambda: axes.plot(
            lambda x: 1.2 * np.sin(1.2*x - phase.get_value()),
            x_range=[0, 8], color=BLUE, stroke_width=3))

        amp_arrow = DoubleArrow(axes.c2p(0.5, 0), axes.c2p(0.5, 1.2), color=YELLOW, buff=0)
        amp_label = MathTex(r"A", font_size=28, color=YELLOW).next_to(amp_arrow, RIGHT, buff=0.1)
        wl_start = axes.c2p(1.0, -1.6)
        wl_end = axes.c2p(1.0 + 2*PI/1.2, -1.6)
        wl_arrow = DoubleArrow(wl_start, wl_end, color=GREEN, buff=0)
        wl_label = MathTex(r"\lambda", font_size=28, color=GREEN).next_to(wl_arrow, DOWN, buff=0.1)
        prop_arrow = Arrow(axes.c2p(6, 0.5), axes.c2p(7.5, 0.5), color=WHITE, buff=0)
        prop_label = MathTex(r"v", font_size=28, color=WHITE).next_to(prop_arrow, UP, buff=0.05)
        eq = MathTex(r"y = A\sin(kx - \omega t)", font_size=28, color=WHITE).to_corner(UR).shift(DOWN*0.5)

        self.play(Write(title))
        self.play(Create(axes))
        self.add(wave)
        self.play(Create(amp_arrow), Write(amp_label), Create(wl_arrow), Write(wl_label))
        self.play(Create(prop_arrow), Write(prop_label), Write(eq))
        self.play(phase.animate.set_value(3*PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "standing_wave",
        "description": (
            "Standing waves form when two identical waves travel in opposite directions. "
            "Nodes are points of zero amplitude; antinodes are points of maximum amplitude. "
            "y = 2A*sin(kx)*cos(wt). "
            "Animate the wave oscillating in place, label nodes and antinodes."
        ),
        "visual_rules": (
            "Standing wave: BLUE oscillating curve. Nodes: RED dots, label 'N'. "
            "Antinodes: YELLOW dots, label 'AN'. Axis: WHITE. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Standing Wave", font_size=34).to_edge(UP)
        axes = Axes(x_range=[0, 4*PI, PI], y_range=[-2.5, 2.5, 1], x_length=9, y_length=4,
                    axis_config={"color": WHITE}).shift(DOWN*0.3)
        t = ValueTracker(0)
        k = 1.0
        wave = always_redraw(lambda: axes.plot(
            lambda x: 2.0 * np.sin(k*x) * np.cos(t.get_value()),
            x_range=[0, 4*PI], color=BLUE, stroke_width=3))

        node_xs = [0, PI, 2*PI, 3*PI, 4*PI]
        node_dots = VGroup(*[Dot(axes.c2p(x, 0), color=RED, radius=0.1) for x in node_xs])
        node_label = Text("N = node", font_size=18, color=RED).to_corner(UL).shift(DOWN*0.5)

        antinode_xs = [PI/2, 3*PI/2, 5*PI/2, 7*PI/2]
        antinode_dots = VGroup(*[Dot(axes.c2p(x, 0), color=YELLOW, radius=0.08) for x in antinode_xs])
        antinode_label = Text("AN = antinode", font_size=18, color=YELLOW).next_to(node_label, DOWN, buff=0.1)
        eq = MathTex(r"y = 2A\sin(kx)\cos(\omega t)", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(axes))
        self.add(wave)
        self.play(FadeIn(node_dots), Write(node_label))
        self.play(FadeIn(antinode_dots), Write(antinode_label))
        self.play(Write(eq))
        self.play(t.animate.set_value(2*PI), run_time=4, rate_func=linear)
        self.play(t.animate.set_value(4*PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "doppler_effect",
        "description": (
            "The Doppler effect: when a wave source moves relative to an observer, "
            "the observed frequency changes. Moving toward: f_obs = f * (v + v_obs)/(v - v_s) (higher pitch). "
            "Moving away: lower pitch. "
            "Animate a moving source with compressed wavefronts in front and stretched behind."
        ),
        "visual_rules": (
            "Source: YELLOW dot moving right. Wavefronts ahead (compressed): BLUE circles, closer together. "
            "Wavefronts behind (stretched): RED circles, farther apart. "
            "Observer: GREEN dot on right side. Labels: WHITE. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Doppler Effect", font_size=34).to_edge(UP)
        source = Dot(LEFT*3, color=YELLOW, radius=0.18)
        src_label = Text("source", font_size=18, color=YELLOW).next_to(source, DOWN, buff=0.1)
        observer = Dot(RIGHT*4.5, color=GREEN, radius=0.18)
        obs_label = Text("observer", font_size=18, color=GREEN).next_to(observer, DOWN, buff=0.1)
        ahead_label = Text("compressed (higher f)", font_size=18, color=BLUE).to_corner(UR).shift(DOWN*0.5)
        behind_label = Text("stretched (lower f)", font_size=18, color=RED).to_corner(UL).shift(DOWN*0.5)

        wavefronts_ahead = VGroup(*[
            Circle(radius=0.4 + 0.3*i, color=BLUE, stroke_width=1.5, fill_opacity=0).move_to(LEFT*2.5 + RIGHT*0.3*i)
            for i in range(5)])
        wavefronts_behind = VGroup(*[
            Circle(radius=0.5 + 0.6*i, color=RED, stroke_width=1.5, fill_opacity=0).move_to(LEFT*3.5 - RIGHT*0.3*i)
            for i in range(4)])

        eq = MathTex(r"f_{obs} = f\frac{v + v_{obs}}{v - v_s}", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(source), Write(src_label), FadeIn(observer), Write(obs_label))
        self.play(Create(wavefronts_ahead), Write(ahead_label))
        self.play(Create(wavefronts_behind), Write(behind_label))
        self.play(Write(eq))
        self.play(source.animate.shift(RIGHT*2), src_label.animate.shift(RIGHT*2),
                  wavefronts_ahead.animate.shift(RIGHT*2), wavefronts_behind.animate.shift(RIGHT*2),
                  run_time=3, rate_func=linear)
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ ELECTRICITY & MAGNETISM
    {
        "topic": "coulombs_law",
        "description": (
            "Coulomb's law: the electrostatic force between two charges is F = k*q1*q2/r^2. "
            "Like charges repel, opposite charges attract. "
            "Show two charges with force arrows pointing away (repulsion) or toward each other (attraction), "
            "electric field lines, and the equation."
        ),
        "visual_rules": (
            "Positive charge: RED circle, label '+q'. Negative charge: BLUE circle, label '-q'. "
            "Repulsive force arrows: RED pointing away, label 'F'. "
            "Attractive force: BLUE arrows toward each other. "
            "Field lines: YELLOW curved lines radiating from +q to -q. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Coulomb's Law: F = k q1 q2 / r^2", font_size=30).to_edge(UP)
        q1 = Circle(radius=0.35, color=RED, fill_opacity=0.8).move_to(LEFT*2.5)
        q1_label = Text("+q1", font_size=20, color=WHITE).move_to(q1.get_center())
        q2 = Circle(radius=0.35, color=RED, fill_opacity=0.8).move_to(RIGHT*2.5)
        q2_label = Text("+q2", font_size=20, color=WHITE).move_to(q2.get_center())

        f1_arrow = Arrow(q1.get_center(), q1.get_center() + LEFT*1.5, color=YELLOW, buff=0.35)
        f1_label = Text("F", font_size=18, color=YELLOW).next_to(f1_arrow.get_end(), LEFT, buff=0.1)
        f2_arrow = Arrow(q2.get_center(), q2.get_center() + RIGHT*1.5, color=YELLOW, buff=0.35)
        f2_label = Text("F", font_size=18, color=YELLOW).next_to(f2_arrow.get_end(), RIGHT, buff=0.1)
        repel_label = Text("Like charges REPEL", font_size=22, color=WHITE).shift(DOWN*0.5)

        eq = MathTex(r"F = \frac{kq_1q_2}{r^2}", font_size=28, color=WHITE).to_edge(DOWN)
        r_arrow = DoubleArrow(q1.get_center(), q2.get_center(), color=GREEN, buff=0.35)
        r_label = Text("r", font_size=20, color=GREEN).next_to(r_arrow, DOWN, buff=0.1)

        self.play(Write(title))
        self.play(FadeIn(q1), Write(q1_label), FadeIn(q2), Write(q2_label))
        self.play(Create(r_arrow), Write(r_label))
        self.play(Create(f1_arrow), Write(f1_label), Create(f2_arrow), Write(f2_label))
        self.play(Write(repel_label))
        self.play(Write(eq))
        self.wait(0.5)
        self.play(
            q2.animate.set_color(BLUE), q2_label.animate.become(Text("-q2", font_size=20, color=WHITE).move_to(RIGHT*2.5)),
            repel_label.animate.become(Text("Opposite charges ATTRACT", font_size=22, color=WHITE).shift(DOWN*0.5)),
            f1_arrow.animate.rotate(PI, about_point=f1_arrow.get_start()),
            f2_arrow.animate.rotate(PI, about_point=f2_arrow.get_start()),
            run_time=1.5
        )
        self.wait(1)""",
    },

    {
        "topic": "electric_field_lines",
        "description": (
            "Electric field lines show the direction and strength of the electric field. "
            "They originate from positive charges and terminate at negative charges. "
            "Field strength E = F/q. Closer lines = stronger field. "
            "Show field lines between a positive and negative charge pair (electric dipole)."
        ),
        "visual_rules": (
            "Positive charge: RED circle, label '+'. Negative charge: BLUE circle, label '-'. "
            "Field lines: YELLOW curved arrows from + to -. "
            "Field vector E at a point: WHITE arrow, label 'E'. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Electric Field Lines (Dipole)", font_size=32).to_edge(UP)
        pos_charge = Circle(radius=0.3, color=RED, fill_opacity=0.9).move_to(LEFT*2)
        pos_label = Text("+", font_size=28, color=WHITE).move_to(pos_charge.get_center())
        neg_charge = Circle(radius=0.3, color=BLUE, fill_opacity=0.9).move_to(RIGHT*2)
        neg_label = Text("-", font_size=28, color=WHITE).move_to(neg_charge.get_center())

        field_lines = VGroup()
        for dy in [-1.2, -0.5, 0, 0.5, 1.2]:
            ctrl = np.array([0, dy * 0.3, 0])
            line = CubicBezier(
                LEFT*1.7 + UP*dy*0.5,
                LEFT*0.5 + UP*dy*0.8 + ctrl,
                RIGHT*0.5 + UP*dy*0.8 + ctrl,
                RIGHT*1.7 + UP*dy*0.5,
                color=YELLOW, stroke_width=2
            )
            field_lines.add(line)

        e_arrow = Arrow(ORIGIN + DOWN*0.8, ORIGIN + DOWN*0.8 + RIGHT*1.0, color=WHITE, buff=0)
        e_label = Text("E", font_size=20, color=WHITE).next_to(e_arrow, DOWN, buff=0.1)
        eq = MathTex(r"E = \frac{F}{q} = \frac{kq}{r^2}", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(pos_charge), Write(pos_label), FadeIn(neg_charge), Write(neg_label))
        self.play(Create(field_lines), run_time=2)
        self.play(Create(e_arrow), Write(e_label))
        self.play(Write(eq))
        self.wait(2)""",
    },

    {
        "topic": "faradays_law",
        "description": (
            "Faraday's law of electromagnetic induction: a changing magnetic flux induces an EMF. "
            "EMF = -dPhi_B/dt. A moving magnet through a coil induces a current. "
            "Lenz's law: induced current opposes the change in flux. "
            "Animate a magnet moving into/out of a coil with induced current arrows."
        ),
        "visual_rules": (
            "Coil: BLUE rectangle loops. Magnet: RED bar with N/S labels. "
            "Magnetic field lines: PURPLE arrows through coil. "
            "Induced current arrows: GREEN circular arrows around coil wire. "
            "EMF symbol: YELLOW. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Faraday's Law: EMF = -d(Phi_B)/dt", font_size=30).to_edge(UP)
        coil = Rectangle(width=3.5, height=2.0, color=BLUE, stroke_width=4).move_to(RIGHT*1.5)
        coil_label = Text("Coil", font_size=20, color=BLUE).next_to(coil, UP, buff=0.1)
        magnet = Rectangle(width=0.8, height=1.5, color=RED, fill_opacity=0.8).move_to(LEFT*3.5)
        n_label = Text("N", font_size=24, color=WHITE).move_to(magnet.get_center() + RIGHT*0.15)
        s_rect = Rectangle(width=0.8, height=0.6, color=BLUE, fill_opacity=0.8).next_to(magnet, LEFT, buff=0)
        s_label = Text("S", font_size=24, color=WHITE).move_to(s_rect.get_center())

        flux_arrows = VGroup(*[
            Arrow(LEFT*2.5 + UP*(0.5-0.5*i), RIGHT*0.3 + UP*(0.5-0.5*i), color=PURPLE, buff=0, stroke_width=2)
            for i in range(3)])
        flux_label = Text("B field", font_size=18, color=PURPLE).next_to(flux_arrows, UP, buff=0.1)
        current_label = Text("Induced current (Lenz's law)", font_size=18, color=GREEN).shift(DOWN*1.5)
        eq = MathTex(r"\mathcal{E} = -\frac{d\Phi_B}{dt}", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(coil), Write(coil_label), FadeIn(magnet), Write(n_label), FadeIn(s_rect), Write(s_label))
        self.play(Create(flux_arrows), Write(flux_label))
        self.play(
            magnet.animate.shift(RIGHT*3.5),
            n_label.animate.shift(RIGHT*3.5),
            s_rect.animate.shift(RIGHT*3.5),
            s_label.animate.shift(RIGHT*3.5),
            flux_arrows.animate.shift(RIGHT*1.5),
            run_time=2.5, rate_func=linear
        )
        self.play(Write(current_label), Write(eq))
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ ENERGY
    {
        "topic": "energy_conservation",
        "description": (
            "Conservation of mechanical energy: total energy E = KE + PE = constant. "
            "For a ball in free fall: PE = mgh decreases, KE = 0.5*mv^2 increases by the same amount. "
            "Animate a ball falling with energy bars showing PE converting to KE, "
            "and the total energy bar remaining constant."
        ),
        "visual_rules": (
            "Ball: YELLOW circle falling. PE bar: BLUE filling down. KE bar: GREEN filling up. "
            "Total E bar: WHITE staying constant. Labels: WHITE. Height arrow: YELLOW, label 'h'. "
            "Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Conservation of Mechanical Energy", font_size=30).to_edge(UP)
        ball = Dot(radius=0.25, color=YELLOW).move_to(UP*2.5 + LEFT*2)
        h_arrow = always_redraw(lambda: DoubleArrow(
            np.array([-2, -1.5, 0]), ball.get_center() + DOWN*0.25, color=YELLOW, buff=0))
        h_label = always_redraw(lambda: Text("h", font_size=20, color=YELLOW).next_to(h_arrow, LEFT, buff=0.1))

        bar_x = RIGHT*1.5
        bar_h = 3.0
        baseline = DOWN*1.5

        pe_bg = Rectangle(width=0.8, height=bar_h, color=GREY, fill_opacity=0.2).move_to(bar_x + UP*0)
        ke_bg = Rectangle(width=0.8, height=bar_h, color=GREY, fill_opacity=0.2).move_to(bar_x + RIGHT*1.2 + UP*0)

        t = ValueTracker(0)
        max_h = 4.0

        def pe_bar():
            frac = max(0, 1 - t.get_value())
            h = frac * bar_h
            return Rectangle(width=0.8, height=h, color=BLUE, fill_opacity=0.8).align_to(
                bar_x + baseline, DOWN).shift(UP*(bar_h - h)/2 + DOWN*(bar_h/2 - h/2))
        def ke_bar():
            frac = min(1, t.get_value())
            h = frac * bar_h
            return Rectangle(width=0.8, height=h, color=GREEN, fill_opacity=0.8).move_to(
                bar_x + RIGHT*1.2 + baseline + UP*h/2)

        pe_rect = always_redraw(pe_bar)
        ke_rect = always_redraw(ke_bar)
        pe_label = Text("PE", font_size=20, color=BLUE).next_to(pe_bg, DOWN, buff=0.15)
        ke_label = Text("KE", font_size=20, color=GREEN).next_to(ke_bg, DOWN, buff=0.15)
        total_label = Text("E=KE+PE=const", font_size=18, color=WHITE).next_to(ke_bg, UP, buff=0.2).shift(LEFT*0.6)
        eq = MathTex(r"mgh = \frac{1}{2}mv^2", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(ball), Create(pe_bg), Create(ke_bg))
        self.play(FadeIn(pe_rect), FadeIn(ke_rect))
        self.add(h_arrow, h_label)
        self.play(Write(pe_label), Write(ke_label), Write(total_label), Write(eq))
        self.play(
            t.animate.set_value(1.0),
            ball.animate.move_to(DOWN*1.5 + LEFT*2),
            run_time=3, rate_func=linear
        )
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ OPTICS
    {
        "topic": "snells_law_refraction",
        "description": (
            "Snell's law describes refraction: n1*sin(theta1) = n2*sin(theta2). "
            "When light passes from one medium to another with different refractive indices, "
            "its angle changes. From less dense to denser medium: angle decreases. "
            "Animate an incoming ray, the interface, the refracted ray, "
            "and the normal line with labeled angles."
        ),
        "visual_rules": (
            "Interface: WHITE horizontal line. Normal: GREY dashed vertical. "
            "Incident ray: YELLOW arrow with angle theta1. Refracted ray: ORANGE arrow with angle theta2. "
            "Medium 1 label: BLUE (above). Medium 2 label: GREEN (below, denser). "
            "Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Snell's Law: n1 sin(th1) = n2 sin(th2)", font_size=28).to_edge(UP)
        interface = Line(LEFT*5 + DOWN*0.5, RIGHT*5 + DOWN*0.5, color=WHITE, stroke_width=2)
        normal = DashedLine(UP*2.5 + DOWN*0.5, DOWN*2.5 + DOWN*0.5, color=GREY, stroke_width=1.5).move_to(DOWN*0.5)

        med1 = Text("Medium 1  (n1 = 1.0)", font_size=20, color=BLUE).move_to(UP*1.5 + LEFT*2.5)
        med2 = Text("Medium 2  (n2 = 1.5)", font_size=20, color=GREEN).move_to(DOWN*2 + LEFT*2.5)

        th1 = 50 * DEGREES
        th2 = np.arcsin(np.sin(th1) / 1.5)

        inc_start = UP*2.5 + LEFT*2.5
        inc_end = DOWN*0.5
        inc_ray = Arrow(inc_start, inc_end, color=YELLOW, buff=0, stroke_width=3)
        inc_label = MathTex(r"\theta_1", font_size=28, color=YELLOW).move_to(inc_end + UP*0.7 + LEFT*0.5)

        ref_end = DOWN*0.5 + DOWN*2.5 + RIGHT*2.5*np.tan(th2)
        ref_ray = Arrow(DOWN*0.5, ref_end, color=ORANGE, buff=0, stroke_width=3)
        ref_label = MathTex(r"\theta_2", font_size=28, color=ORANGE).move_to(DOWN*0.5 + DOWN*0.7 + RIGHT*0.5)

        th1_arc = Arc(radius=0.6, start_angle=PI/2, angle=-th1, arc_center=DOWN*0.5, color=YELLOW)
        th2_arc = Arc(radius=0.6, start_angle=-PI/2, angle=th2, arc_center=DOWN*0.5, color=ORANGE)
        eq = MathTex(r"n_1\sin\theta_1 = n_2\sin\theta_2", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(interface), Create(normal))
        self.play(Write(med1), Write(med2))
        self.play(Create(inc_ray), Create(th1_arc), Write(inc_label))
        self.play(Create(ref_ray), Create(th2_arc), Write(ref_label))
        self.play(Write(eq))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ MODERN PHYSICS / THERMO
    {
        "topic": "photoelectric_effect",
        "description": (
            "The photoelectric effect: photons hitting a metal surface eject electrons if hf > work function phi. "
            "Kinetic energy of ejected electron: KE = hf - phi. "
            "Einstein's explanation confirmed the particle nature of light. "
            "Animate photons hitting a metal surface, electrons being ejected above the threshold, "
            "and none ejected below threshold."
        ),
        "visual_rules": (
            "Metal surface: GREY rectangle. Photons: YELLOW zigzag arrows striking surface. "
            "Ejected electrons: BLUE dots flying off. Threshold line: RED dashed, label 'phi'. "
            "Labels: WHITE. Equation: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Photoelectric Effect: KE = hf - phi", font_size=30).to_edge(UP)
        metal = Rectangle(width=8, height=1.2, color=GREY, fill_opacity=0.7).move_to(DOWN*1.5)
        metal_label = Text("Metal Surface", font_size=20, color=WHITE).move_to(metal.get_center())

        phi_line = DashedLine(LEFT*4 + DOWN*0.5, RIGHT*4 + DOWN*0.5, color=RED, stroke_width=2)
        phi_label = Text("Work function phi", font_size=18, color=RED).next_to(phi_line, RIGHT, buff=0.1)

        photon1 = Arrow(UP*2.5 + LEFT*2, DOWN*0.9 + LEFT*2, color=YELLOW, buff=0, stroke_width=3)
        photon1_label = MathTex(r"hf > \phi", font_size=24, color=YELLOW).next_to(photon1, LEFT, buff=0.1)
        electron = Dot(radius=0.12, color=BLUE).move_to(DOWN*0.9 + LEFT*2)
        e_arrow = Arrow(DOWN*0.9 + LEFT*2, UP*1.5 + LEFT*0.5, color=BLUE, buff=0.12, stroke_width=3)
        e_label = Text("e- ejected!", font_size=18, color=BLUE).next_to(e_arrow.get_end(), UP, buff=0.05)

        photon2 = Arrow(UP*2.5 + RIGHT*2.5, DOWN*0.9 + RIGHT*2.5, color=ORANGE, buff=0, stroke_width=3)
        photon2_label = MathTex(r"hf < \phi", font_size=24, color=ORANGE).next_to(photon2, RIGHT, buff=0.1)
        no_eject = Text("No electron!", font_size=18, color=RED).move_to(UP*0.5 + RIGHT*2.5)

        eq = MathTex(r"KE_{max} = hf - \phi", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(metal), Write(metal_label))
        self.play(Create(phi_line), Write(phi_label))
        self.play(Create(photon1), Write(photon1_label))
        self.play(FadeIn(electron))
        self.play(Create(e_arrow), Write(e_label))
        self.play(Create(photon2), Write(photon2_label))
        self.play(Write(no_eject))
        self.play(Write(eq))
        self.wait(1)""",
    },

    {
        "topic": "ideal_gas_law",
        "description": (
            "The ideal gas law: PV = nRT. "
            "Pressure P is caused by gas molecules colliding with container walls. "
            "As temperature increases, molecules move faster, increasing pressure or volume. "
            "Animate molecules bouncing around inside a container, "
            "show pressure arrows on walls, and label P, V, T, n."
        ),
        "visual_rules": (
            "Container: WHITE rectangle outline. Molecules: BLUE dots moving randomly. "
            "Pressure arrows on walls: RED outward arrows. Temperature label: ORANGE. "
            "Labels P, V, T, n: WHITE. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Ideal Gas Law: PV = nRT", font_size=34).to_edge(UP)
        box = Rectangle(width=5, height=3.5, color=WHITE, stroke_width=3).move_to(ORIGIN + DOWN*0.3)

        n_molecules = 8
        np.random.seed(42)
        positions = [np.array([np.random.uniform(-2.2, 2.2), np.random.uniform(-1.5, 1.3), 0]) for _ in range(n_molecules)]
        molecules = VGroup(*[Dot(pos, radius=0.12, color=BLUE) for pos in positions])

        p_arrows = VGroup(
            Arrow(box.get_right(), box.get_right() + RIGHT*0.8, color=RED, buff=0, stroke_width=2),
            Arrow(box.get_left(), box.get_left() + LEFT*0.8, color=RED, buff=0, stroke_width=2),
            Arrow(box.get_top(), box.get_top() + UP*0.8, color=RED, buff=0, stroke_width=2),
            Arrow(box.get_bottom(), box.get_bottom() + DOWN*0.8, color=RED, buff=0, stroke_width=2),
        )

        p_label = Text("P", font_size=20, color=RED).next_to(p_arrows[0], RIGHT, buff=0.1)
        v_label = Text("V", font_size=20, color=WHITE).move_to(box.get_center() + DOWN*0.3)
        t_label = Text("T (temperature)", font_size=20, color=ORANGE).to_corner(DL).shift(UP*0.3)
        n_label = Text("n (moles)", font_size=20, color=GREEN).next_to(t_label, UP, buff=0.1)
        eq = MathTex(r"PV = nRT", font_size=32, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(box))
        self.play(FadeIn(molecules))
        self.play(Create(p_arrows), Write(p_label))
        self.play(Write(v_label), Write(t_label), Write(n_label))
        self.play(Write(eq))
        self.play(molecules.animate.shift(RIGHT*0.3), run_time=0.5, rate_func=there_and_back)
        self.play(molecules.animate.shift(LEFT*0.3 + UP*0.2), run_time=0.5, rate_func=there_and_back)
        self.play(molecules.animate.shift(RIGHT*0.2 + DOWN*0.15), run_time=0.5, rate_func=there_and_back)
        self.wait(1)""",
    },

    {
        "topic": "gravitational_field",
        "description": (
            "Gravitational field g = GM/r^2 points toward the mass. "
            "Gravitational potential energy U = -GMm/r. "
            "For Earth's surface: g = 9.8 m/s^2 downward. "
            "Show a planet with gravitational field vectors pointing inward, "
            "and a satellite orbit with centripetal force provided by gravity."
        ),
        "visual_rules": (
            "Planet: BLUE filled circle, label 'M'. Satellite: YELLOW dot. "
            "Gravitational field vectors: RED arrows pointing toward planet center. "
            "Orbit path: WHITE dashed circle. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Gravitational Field: g = GM/r^2", font_size=32).to_edge(UP)
        planet = Circle(radius=0.7, color=BLUE, fill_opacity=0.9).move_to(ORIGIN + DOWN*0.3)
        planet_label = Text("M", font_size=24, color=WHITE).move_to(planet.get_center())
        orbit = DashedVMobject(Circle(radius=2.5, color=WHITE).move_to(planet.get_center()), num_dashes=30)

        field_vectors = VGroup()
        for angle in range(0, 360, 45):
            rad = angle * DEGREES
            start = planet.get_center() + 2.3 * np.array([np.cos(rad), np.sin(rad), 0])
            end = planet.get_center() + 0.85 * np.array([np.cos(rad), np.sin(rad), 0])
            field_vectors.add(Arrow(start, end, color=RED, buff=0, stroke_width=2,
                                    max_tip_length_to_length_ratio=0.3))
        g_label = Text("g field", font_size=18, color=RED).to_corner(DR).shift(UP*0.5 + LEFT*0.5)

        angle_t = ValueTracker(0)
        satellite = always_redraw(lambda: Dot(
            planet.get_center() + 2.5 * np.array([np.cos(angle_t.get_value()), np.sin(angle_t.get_value()), 0]),
            color=YELLOW, radius=0.14))
        eq = MathTex(r"g = \frac{GM}{r^2}, \quad F_{grav} = mg", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(planet), Write(planet_label))
        self.play(Create(orbit))
        self.play(Create(field_vectors), Write(g_label))
        self.add(satellite)
        self.play(Write(eq))
        self.play(angle_t.animate.set_value(2*PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "wave_interference",
        "description": (
            "Wave interference: constructive (crest meets crest, amplitude doubles) "
            "and destructive (crest meets trough, cancel out). "
            "Two coherent sources produce an interference pattern. "
            "Animate two waves and their superposition, showing constructive and destructive regions."
        ),
        "visual_rules": (
            "Wave 1: BLUE sinusoid. Wave 2: RED sinusoid. "
            "Superposition: YELLOW (brighter in constructive, flat in destructive). "
            "Constructive zones: GREEN shading. Destructive zones: RED shading. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Wave Interference", font_size=34).to_edge(UP)
        axes1 = Axes(x_range=[0, 4*PI, PI], y_range=[-2, 2, 1], x_length=9, y_length=1.8,
                     axis_config={"color": WHITE}).shift(UP*1.8)
        axes2 = Axes(x_range=[0, 4*PI, PI], y_range=[-2, 2, 1], x_length=9, y_length=1.8,
                     axis_config={"color": WHITE}).shift(UP*0)
        axes3 = Axes(x_range=[0, 4*PI, PI], y_range=[-4, 4, 1], x_length=9, y_length=1.8,
                     axis_config={"color": WHITE}).shift(DOWN*1.8)

        phase = ValueTracker(0)
        wave1 = always_redraw(lambda: axes1.plot(lambda x: 1.2*np.sin(x + phase.get_value()),
                                                  x_range=[0, 4*PI], color=BLUE))
        wave2 = always_redraw(lambda: axes2.plot(lambda x: 1.2*np.sin(x + phase.get_value() + 0),
                                                  x_range=[0, 4*PI], color=RED))
        superpos = always_redraw(lambda: axes3.plot(lambda x: 2.4*np.sin(x + phase.get_value()),
                                                     x_range=[0, 4*PI], color=YELLOW))

        w1_label = Text("Wave 1", font_size=18, color=BLUE).next_to(axes1, LEFT)
        w2_label = Text("Wave 2", font_size=18, color=RED).next_to(axes2, LEFT)
        sup_label = Text("Sum", font_size=18, color=YELLOW).next_to(axes3, LEFT)
        con_label = Text("Constructive", font_size=18, color=GREEN).to_corner(UR).shift(DOWN*0.5)
        eq = MathTex(r"y_{total} = y_1 + y_2", font_size=28, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(axes1), Create(axes2), Create(axes3))
        self.add(wave1, wave2, superpos)
        self.play(Write(w1_label), Write(w2_label), Write(sup_label), Write(con_label))
        self.play(Write(eq))
        self.play(phase.animate.set_value(2*PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ FROM USER DRIVE VIDEOS

    {
        "topic": "double_pendulum",
        "description": (
            "A double pendulum consists of two rods and two bobs. The first bob hangs from a fixed pivot; "
            "the second hangs from the first bob. The system exhibits chaotic, sensitive-to-initial-conditions motion. "
            "Forces on each bob: gravity (mg, RED), tension in the rod above (GREEN), and the pull of the rod below (BLUE). "
            "Animate both rods swinging with the second bob tracing a chaotic red path. "
            "Show the pivot, both rods, both bobs, gravity arrows on each bob, and a trace of the lower bob's trajectory. "
            "Label angle theta1 (upper rod) and theta2 (lower rod). Show the Lagrangian kinetic energy equation."
        ),
        "visual_rules": (
            "Pivot: WHITE dot at top. Rod 1: BLUE line. Bob 1: YELLOW circle. "
            "Rod 2: GREEN line. Bob 2: ORANGE circle. "
            "Gravity on bob 1: RED arrow, label 'mg'. Gravity on bob 2: RED arrow, label 'mg'. "
            "Trace path of bob 2: RED fading trail. "
            "Angle arcs: ORANGE for theta1, PURPLE for theta2. Equation: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Double Pendulum (Chaotic Motion)", font_size=30).to_edge(UP)
        pivot = Dot(UP * 2.8, color=WHITE, radius=0.1)
        pivot_label = Text("Pivot", font_size=16, color=WHITE).next_to(pivot, UP, buff=0.1)

        L1, L2 = 1.8, 1.6
        th1 = ValueTracker(0.9)
        th2 = ValueTracker(1.4)

        def bob1_pos():
            return pivot.get_center() + L1 * np.array([np.sin(th1.get_value()), -np.cos(th1.get_value()), 0])
        def bob2_pos():
            return bob1_pos() + L2 * np.array([np.sin(th2.get_value()), -np.cos(th2.get_value()), 0])

        rod1 = always_redraw(lambda: Line(pivot.get_center(), bob1_pos(), color=BLUE, stroke_width=4))
        bob1 = always_redraw(lambda: Circle(radius=0.2, color=YELLOW, fill_opacity=0.9).move_to(bob1_pos()))
        rod2 = always_redraw(lambda: Line(bob1_pos(), bob2_pos(), color=GREEN, stroke_width=4))
        bob2 = always_redraw(lambda: Circle(radius=0.18, color=ORANGE, fill_opacity=0.9).move_to(bob2_pos()))

        mg1 = always_redraw(lambda: Arrow(bob1_pos(), bob1_pos() + DOWN * 0.8,
            color=RED, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        mg1_label = always_redraw(lambda: Text("mg", font_size=16, color=RED).next_to(mg1.get_end(), RIGHT, buff=0.05))
        mg2 = always_redraw(lambda: Arrow(bob2_pos(), bob2_pos() + DOWN * 0.8,
            color=RED, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        mg2_label = always_redraw(lambda: Text("mg", font_size=16, color=RED).next_to(mg2.get_end(), RIGHT, buff=0.05))

        arc1 = always_redraw(lambda: Arc(radius=0.5, start_angle=-PI/2,
            angle=th1.get_value(), arc_center=pivot.get_center(), color=ORANGE))
        th1_label = always_redraw(lambda: Text("th1", font_size=16, color=ORANGE).move_to(
            pivot.get_center() + 0.75 * np.array([np.sin(th1.get_value()/2), -np.cos(th1.get_value()/2), 0])))
        arc2 = always_redraw(lambda: Arc(radius=0.5, start_angle=-PI/2,
            angle=th2.get_value(), arc_center=bob1_pos(), color=PURPLE))
        th2_label = always_redraw(lambda: Text("th2", font_size=16, color=PURPLE).move_to(
            bob1_pos() + 0.75 * np.array([np.sin(th2.get_value()/2), -np.cos(th2.get_value()/2), 0])))

        eq = MathTex(r"\mathcal{L} = \frac{1}{2}(m_1+m_2)L_1^2\dot\theta_1^2 + \cdots", font_size=24, color=WHITE).to_edge(DOWN)

        trail = VMobject(color=RED, stroke_width=1.5, stroke_opacity=0.6)
        trail.set_points_as_corners([bob2_pos(), bob2_pos()])

        self.play(Write(title))
        self.play(FadeIn(pivot), Write(pivot_label))
        self.add(rod1, bob1, rod2, bob2, mg1, mg1_label, mg2, mg2_label,
                 arc1, th1_label, arc2, th2_label, trail)
        self.play(Write(eq))

        angles = [(0.9, 1.4), (-0.7, 1.8), (1.1, -0.9), (-1.0, 0.6),
                  (0.5, 2.0), (-1.2, -1.1), (0.8, 0.3), (-0.4, 1.6)]
        for a1, a2 in angles:
            old_pos = bob2_pos().copy()
            self.play(th1.animate.set_value(a1), th2.animate.set_value(a2), run_time=0.9, rate_func=linear)
            new_pos = bob2_pos().copy()
            trail.add_points_as_corners([new_pos])
        self.wait(1)""",
    },

    {
        "topic": "kinematics_suvat",
        "description": (
            "Kinematics: the study of motion without regard to forces. "
            "Key equations (SUVAT): s = ut + 0.5at^2, v = u + at, v^2 = u^2 + 2as. "
            "Show a distance-time graph (parabolic for constant acceleration), "
            "a velocity-time graph (linear for constant acceleration, area = displacement), "
            "and a moving object (car/dot) accelerating along a track. "
            "Label initial velocity u, final velocity v, acceleration a, displacement s, and time t."
        ),
        "visual_rules": (
            "Distance-time graph: BLUE parabolic curve, axes WHITE. "
            "Velocity-time graph: GREEN linear curve, shaded area = displacement (YELLOW). "
            "Moving object: RED dot sliding right with increasing speed. "
            "Arrows showing u (GREEN), v (ORANGE), a (PURPLE). "
            "SUVAT equations: WHITE text on right side."
        ),
        "manim_code": """\
        title = Text("Kinematics: SUVAT Equations", font_size=32).to_edge(UP)

        axes_s = Axes(x_range=[0, 4, 1], y_range=[0, 8, 2], x_length=4.5, y_length=2.8,
                      axis_config={"color": WHITE}).shift(LEFT * 2.8 + UP * 0.3)
        s_label = Text("s-t graph", font_size=18, color=BLUE).next_to(axes_s, UP, buff=0.1)
        xl1 = Text("t", font_size=16).next_to(axes_s.x_axis, RIGHT)
        yl1 = Text("s", font_size=16).next_to(axes_s.y_axis, UP)

        u, a = 1.0, 1.0
        s_curve = axes_s.plot(lambda t: u * t + 0.5 * a * t**2, x_range=[0, 4], color=BLUE)

        axes_v = Axes(x_range=[0, 4, 1], y_range=[0, 6, 2], x_length=4.5, y_length=2.8,
                      axis_config={"color": WHITE}).shift(RIGHT * 2.0 + UP * 0.3)
        v_label = Text("v-t graph", font_size=18, color=GREEN).next_to(axes_v, UP, buff=0.1)
        xl2 = Text("t", font_size=16).next_to(axes_v.x_axis, RIGHT)
        yl2 = Text("v", font_size=16).next_to(axes_v.y_axis, UP)

        v_curve = axes_v.plot(lambda t: u + a * t, x_range=[0, 4], color=GREEN)
        area = axes_v.get_area(v_curve, x_range=[0, 4], color=YELLOW, opacity=0.25)
        area_label = Text("area = s", font_size=16, color=YELLOW).move_to(axes_v.c2p(2, 1.5))

        eqs = VGroup(
            MathTex(r"v = u + at", font_size=28, color=WHITE),
            MathTex(r"s = ut + \frac{1}{2}at^2", font_size=28, color=WHITE),
            MathTex(r"v^2 = u^2 + 2as", font_size=28, color=WHITE),
        ).arrange(DOWN, buff=0.3).to_edge(DOWN).shift(UP * 0.2)

        track = Line(LEFT * 5.5 + DOWN * 1.8, RIGHT * 5.5 + DOWN * 1.8, color=GREY)
        obj = Dot(LEFT * 5 + DOWN * 1.8, color=RED, radius=0.18)
        t_tracker = ValueTracker(0)
        obj_moving = always_redraw(lambda: Dot(
            axes_s.c2p(0, 0) + LEFT * 5 + RIGHT * (u * t_tracker.get_value() + 0.5 * a * t_tracker.get_value()**2) * 0.6,
            color=RED, radius=0.18).shift(DOWN * 2.1))

        self.play(Write(title))
        self.play(Create(axes_s), Write(s_label), Write(xl1), Write(yl1))
        self.play(Create(axes_v), Write(v_label), Write(xl2), Write(yl2))
        self.play(Create(s_curve), Create(v_curve), run_time=2)
        self.play(FadeIn(area), Write(area_label))
        self.play(Write(eqs[0]), Write(eqs[1]), Write(eqs[2]))
        self.play(Create(track), FadeIn(obj_moving))
        self.play(t_tracker.animate.set_value(4), run_time=3, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "magnetism_lorentz_force",
        "description": (
            "Magnetism: a moving charge in a magnetic field experiences the Lorentz force F = qv x B. "
            "A current-carrying wire in a magnetic field feels force F = IL x B. "
            "Magnetic field B is represented by dots (out of page) or crosses (into page). "
            "Show a wire carrying current I in a field B (into page), "
            "with the magnetic force F on the wire (upward, using right-hand rule). "
            "Also show a charged particle curving in the magnetic field. "
            "Label B field, current I, force F, and show the equation F = qvB sin(theta)."
        ),
        "visual_rules": (
            "Magnetic field (into page): BLUE crosses arranged in a grid. "
            "Wire: ORANGE vertical rectangle, label 'I'. "
            "Force on wire: RED arrow pointing left/up, label 'F = IL x B'. "
            "Particle path: YELLOW curved arc (circular). "
            "Particle: GREEN dot. Velocity arrow: GREEN, label 'v'. "
            "Right-hand rule diagram: WHITE arrows. Equation: WHITE."
        ),
        "manim_code": """\
        title = Text("Magnetic Force: F = qv x B", font_size=32).to_edge(UP)

        field_label = Text("B (into page)", font_size=20, color=BLUE).to_corner(UL).shift(DOWN * 0.5)
        crosses = VGroup()
        for i in range(-3, 4):
            for j in range(-2, 2):
                cross_pos = np.array([i * 1.0, j * 0.9 - 0.3, 0])
                c1 = Line(cross_pos + UL * 0.12, cross_pos + DR * 0.12, color=BLUE, stroke_width=2)
                c2 = Line(cross_pos + UR * 0.12, cross_pos + DL * 0.12, color=BLUE, stroke_width=2)
                crosses.add(c1, c2)

        wire = Rectangle(width=0.25, height=2.5, color=ORANGE, fill_opacity=0.8).move_to(LEFT * 2 + DOWN * 0.3)
        i_arrow = Arrow(LEFT * 2 + DOWN * 1.5, LEFT * 2 + UP * 1.5, color=ORANGE, buff=0.12,
                        stroke_width=3, max_tip_length_to_length_ratio=0.2)
        i_label = Text("I", font_size=22, color=ORANGE).next_to(wire, RIGHT, buff=0.1)
        f_arrow = Arrow(LEFT * 2 + DOWN * 0.3, LEFT * 2 + LEFT * 1.8 + DOWN * 0.3,
                        color=RED, buff=0, stroke_width=3)
        f_label = Text("F = IL x B", font_size=18, color=RED).next_to(f_arrow.get_end(), DOWN, buff=0.1)

        particle_center = RIGHT * 2.5 + DOWN * 0.5
        particle_radius = 1.2
        particle_path = Circle(radius=particle_radius, color=YELLOW, stroke_width=2).move_to(particle_center)
        angle_t = ValueTracker(0)
        particle = always_redraw(lambda: Dot(
            particle_center + particle_radius * np.array([np.cos(angle_t.get_value()), np.sin(angle_t.get_value()), 0]),
            color=GREEN, radius=0.14))
        v_dir = always_redraw(lambda: np.array([-np.sin(angle_t.get_value()), np.cos(angle_t.get_value()), 0]))
        v_arrow = always_redraw(lambda: Arrow(
            particle.get_center(), particle.get_center() + v_dir.get_value() * 0.7,
            color=GREEN, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        v_label = always_redraw(lambda: Text("v", font_size=18, color=GREEN).next_to(v_arrow.get_end(), UR, buff=0.05))
        particle_label = Text("q", font_size=18, color=GREEN).next_to(particle_center, DOWN, buff=1.5)

        eq = MathTex(r"F = qvB\sin\theta, \quad r = \frac{mv}{qB}", font_size=26, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(FadeIn(crosses), Write(field_label))
        self.play(FadeIn(wire), Create(i_arrow), Write(i_label))
        self.play(Create(f_arrow), Write(f_label))
        self.play(Create(particle_path))
        self.add(particle, v_arrow, v_label)
        self.play(Write(particle_label), Write(eq))
        self.play(angle_t.animate.set_value(2 * PI), run_time=4, rate_func=linear)
        self.wait(1)""",
    },

    {
        "topic": "series_circuit",
        "description": (
            "A series circuit: components connected end-to-end so the same current flows through all. "
            "Total resistance R_total = R1 + R2 + R3. Voltage divides: V1 = IR1, V2 = IR2. "
            "Current I = V / R_total (Ohm's law). "
            "Animate a battery connected to three resistors in series with current arrows flowing. "
            "Label the battery voltage, each resistor value, current I, and voltage drop across each resistor. "
            "Show a voltmeter reading across one resistor and Kirchhoff's voltage law: V = V1 + V2 + V3."
        ),
        "visual_rules": (
            "Battery: WHITE rectangle with + / - labels and EMF symbol. "
            "Wires: WHITE lines forming a closed loop. "
            "Resistors: YELLOW rectangles, labeled R1, R2, R3. "
            "Current arrows: GREEN arrows along wires in direction of conventional current, label 'I'. "
            "Voltage drop labels: BLUE, label 'V1', 'V2', 'V3'. "
            "Equations: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Series Circuit: R_total = R1 + R2 + R3", font_size=28).to_edge(UP)

        tl = np.array([-5.0,  1.5, 0])
        tr = np.array([ 5.0,  1.5, 0])
        bl = np.array([-5.0, -1.8, 0])
        br = np.array([ 5.0, -1.8, 0])

        wire_top    = Line(tl, tr, color=WHITE, stroke_width=3)
        wire_right  = Line(tr, br, color=WHITE, stroke_width=3)
        wire_bottom = Line(br, bl, color=WHITE, stroke_width=3)
        wire_left   = Line(bl, tl, color=WHITE, stroke_width=3)

        battery = Rectangle(width=0.4, height=1.2, color=WHITE, fill_opacity=0.15).move_to(tl + RIGHT * 0.2 + DOWN * 0.6)
        batt_plus  = Text("+", font_size=20, color=RED).next_to(battery, UP, buff=0.05)
        batt_minus = Text("-", font_size=20, color=BLUE).next_to(battery, DOWN, buff=0.05)
        batt_label = Text("12 V", font_size=18, color=WHITE).next_to(battery, LEFT, buff=0.15)

        r1_pos = np.array([-1.5, 1.5, 0])
        r2_pos = np.array([ 1.0, 1.5, 0])
        r3_pos = np.array([ 3.5, 1.5, 0])
        r1 = Rectangle(width=1.0, height=0.5, color=YELLOW, fill_opacity=0.4).move_to(r1_pos)
        r2 = Rectangle(width=1.0, height=0.5, color=YELLOW, fill_opacity=0.4).move_to(r2_pos)
        r3 = Rectangle(width=1.0, height=0.5, color=YELLOW, fill_opacity=0.4).move_to(r3_pos)
        r1_label = Text("R1=2ohm", font_size=16, color=YELLOW).next_to(r1, UP, buff=0.08)
        r2_label = Text("R2=3ohm", font_size=16, color=YELLOW).next_to(r2, UP, buff=0.08)
        r3_label = Text("R3=1ohm", font_size=16, color=YELLOW).next_to(r3, UP, buff=0.08)
        v1_label = Text("V1=4V", font_size=15, color=BLUE).next_to(r1, DOWN, buff=0.08)
        v2_label = Text("V2=6V", font_size=15, color=BLUE).next_to(r2, DOWN, buff=0.08)
        v3_label = Text("V3=2V", font_size=15, color=BLUE).next_to(r3, DOWN, buff=0.08)

        i1 = Arrow(tl + RIGHT*0.5, r1_pos + LEFT*0.7, color=GREEN, buff=0, stroke_width=2,
                   max_tip_length_to_length_ratio=0.3)
        i2 = Arrow(r1_pos + RIGHT*0.6, r2_pos + LEFT*0.7, color=GREEN, buff=0, stroke_width=2,
                   max_tip_length_to_length_ratio=0.3)
        i3 = Arrow(r2_pos + RIGHT*0.6, r3_pos + LEFT*0.7, color=GREEN, buff=0, stroke_width=2,
                   max_tip_length_to_length_ratio=0.3)
        i_label = Text("I = 2A", font_size=18, color=GREEN).move_to(np.array([0.0, 2.2, 0]))

        eq1 = MathTex(r"R_{total} = R_1+R_2+R_3 = 6\,\Omega", font_size=24, color=WHITE).to_edge(DOWN).shift(UP * 0.4)
        eq2 = MathTex(r"I = \frac{V}{R} = 2\text{A}, \quad V = V_1+V_2+V_3", font_size=24, color=WHITE).next_to(eq1, DOWN)

        self.play(Write(title))
        self.play(Create(wire_top), Create(wire_right), Create(wire_bottom), Create(wire_left))
        self.play(FadeIn(battery), Write(batt_plus), Write(batt_minus), Write(batt_label))
        self.play(FadeIn(r1), Write(r1_label), FadeIn(r2), Write(r2_label), FadeIn(r3), Write(r3_label))
        self.play(Create(i1), Create(i2), Create(i3), Write(i_label))
        self.play(Write(v1_label), Write(v2_label), Write(v3_label))
        self.play(Write(eq1), Write(eq2))
        self.wait(2)""",
    },

    {
        "topic": "trolley_newtons_third_law",
        "description": (
            "Newton's third law and the trolley/Atwood machine: for every action there is an equal and opposite reaction. "
            "A hanging mass m2 pulls a cart m1 along a track via a string over a pulley. "
            "Tension T is the same throughout the string. "
            "Net force = m2*g (weight of hanging mass). Total mass = m1 + m2. "
            "Acceleration a = m2*g / (m1 + m2). "
            "Animate the cart accelerating along the track and the hanging mass descending, "
            "with tension arrows on both, gravity on the hanging mass, and normal force on the cart. "
            "Show action-reaction pair: cart pulls string left, string pulls cart right."
        ),
        "visual_rules": (
            "Track: GREY horizontal line. Cart: BLUE rectangle, label 'm1'. "
            "Pulley: WHITE circle at track edge. String: WHITE line over pulley to hanging mass. "
            "Hanging mass: RED rectangle, label 'm2'. "
            "Tension arrows: GREEN, label 'T' on both cart and hanging mass. "
            "Gravity on hanging mass: RED arrow down, label 'm2*g'. "
            "Normal force on cart: GREEN arrow up, label 'N'. "
            "Action-reaction labels: ORANGE. Equation: WHITE at bottom."
        ),
        "manim_code": """\
        title = Text("Trolley & Newton's 3rd Law", font_size=32).to_edge(UP)
        track = Line(LEFT * 5.5 + UP * 0.5, RIGHT * 2.5 + UP * 0.5, color=GREY, stroke_width=4)
        pulley_center = np.array([2.5, 0.5, 0])
        pulley = Circle(radius=0.3, color=WHITE, stroke_width=3).move_to(pulley_center)

        cart_x = ValueTracker(-3.5)
        cart = always_redraw(lambda: Rectangle(width=1.4, height=0.7, color=BLUE, fill_opacity=0.7)
                             .move_to(np.array([cart_x.get_value(), 0.85, 0])))
        m1_label = always_redraw(lambda: Text("m1", font_size=20, color=WHITE)
                                 .move_to(np.array([cart_x.get_value(), 0.85, 0])))
        cart_string = always_redraw(lambda: Line(
            np.array([cart_x.get_value() + 0.7, 0.85, 0]),
            pulley_center + LEFT * 0.3,
            color=WHITE, stroke_width=2))

        hang_y = ValueTracker(0.2)
        hang_mass = always_redraw(lambda: Rectangle(width=0.7, height=0.7, color=RED, fill_opacity=0.7)
                                  .move_to(np.array([2.5, hang_y.get_value(), 0])))
        m2_label = always_redraw(lambda: Text("m2", font_size=18, color=WHITE)
                                 .move_to(np.array([2.5, hang_y.get_value(), 0])))
        hang_string = always_redraw(lambda: Line(
            pulley_center + DOWN * 0.3,
            np.array([2.5, hang_y.get_value() + 0.35, 0]),
            color=WHITE, stroke_width=2))

        t1_arrow = always_redraw(lambda: Arrow(
            np.array([cart_x.get_value() + 0.7, 0.85, 0]),
            np.array([cart_x.get_value() + 1.5, 0.85, 0]),
            color=GREEN, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        t1_label = always_redraw(lambda: Text("T", font_size=18, color=GREEN)
                                 .next_to(t1_arrow.get_end(), UP, buff=0.05))
        t2_arrow = always_redraw(lambda: Arrow(
            np.array([2.5, hang_y.get_value() + 0.35, 0]),
            np.array([2.5, hang_y.get_value() + 1.1, 0]),
            color=GREEN, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        t2_label = always_redraw(lambda: Text("T", font_size=18, color=GREEN)
                                 .next_to(t2_arrow.get_end(), RIGHT, buff=0.05))
        mg_arrow = always_redraw(lambda: Arrow(
            np.array([2.5, hang_y.get_value(), 0]),
            np.array([2.5, hang_y.get_value() - 0.9, 0]),
            color=RED, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        mg_label = always_redraw(lambda: Text("m2g", font_size=16, color=RED)
                                 .next_to(mg_arrow.get_end(), RIGHT, buff=0.05))
        n_arrow = always_redraw(lambda: Arrow(
            np.array([cart_x.get_value(), 0.5, 0]),
            np.array([cart_x.get_value(), 1.35, 0]),
            color=GREEN, buff=0, stroke_width=2, max_tip_length_to_length_ratio=0.3))
        n_label = always_redraw(lambda: Text("N", font_size=16, color=GREEN)
                                .next_to(n_arrow.get_end(), LEFT, buff=0.05))

        action_label = Text("Action: string pulls cart RIGHT", font_size=16, color=ORANGE).shift(DOWN * 2.5 + LEFT * 1.5)
        react_label  = Text("Reaction: cart pulls string LEFT", font_size=16, color=ORANGE).next_to(action_label, DOWN, buff=0.1)
        eq = MathTex(r"a = \frac{m_2 g}{m_1+m_2}, \quad T = \frac{m_1 m_2 g}{m_1+m_2}", font_size=24, color=WHITE).to_edge(DOWN)

        self.play(Write(title))
        self.play(Create(track), Create(pulley))
        self.add(cart, m1_label, hang_mass, m2_label, cart_string, hang_string)
        self.add(t1_arrow, t1_label, t2_arrow, t2_label, mg_arrow, mg_label, n_arrow, n_label)
        self.play(Write(action_label), Write(react_label), Write(eq))
        self.play(
            cart_x.animate.set_value(0.5),
            hang_y.animate.set_value(-2.0),
            run_time=3, rate_func=linear
        )
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ FLUID MECHANICS
    {
        "topic": "buoyancy_archimedes",
        "description": (
            "Buoyancy: an object submerged in fluid experiences an upward buoyant force equal to the "
            "weight of displaced fluid (Archimedes' principle: F_b = rho_f * V * g). "
            "Show a block in a blue fluid rectangle with an upward GREEN arrow for buoyancy "
            "and a downward RED arrow for weight. Display F_b = rho*V*g and net force."
        ),
        "visual_rules": (
            "Fluid: blue semi-transparent rectangle. Object: ORANGE square inside fluid. "
            "Buoyancy arrow: GREEN pointing up, label F_b. Weight arrow: RED pointing down, label W. "
            "Equations in WHITE at bottom. If F_b > W: rises (GREEN text), else sinks (RED text)."
        ),
        "manim_code": """\
        rho_f, V, g_acc = 1000, 0.001, 9.8
        F_b = rho_f * V * g_acc
        W   = 500 * V * g_acc
        title = Text("Archimedes Principle", font_size=30).to_edge(UP)
        fluid = Rectangle(width=6, height=3, color=BLUE_E, fill_opacity=0.3).shift(DOWN * 0.5)
        obj   = Square(side_length=0.9, color=ORANGE, fill_opacity=0.85)
        fb_arrow = Arrow(obj.get_bottom(), obj.get_bottom() + UP * 1.4, color=GREEN, buff=0)
        fb_lbl   = MathTex(r"F_b = \rho_f V g", font_size=24, color=GREEN).next_to(fb_arrow, LEFT, buff=0.1)
        w_arrow  = Arrow(obj.get_top(), obj.get_top() + DOWN * 1.1, color=RED, buff=0)
        w_lbl    = MathTex(r"W = mg", font_size=24, color=RED).next_to(w_arrow, RIGHT, buff=0.1)
        eq       = MathTex(r"F_b = \rho_f V g", font_size=26, color=WHITE).to_edge(DOWN)
        self.play(Write(title))
        self.play(Create(fluid))
        self.play(FadeIn(obj))
        self.play(Create(fb_arrow), Write(fb_lbl), Create(w_arrow), Write(w_lbl))
        self.play(Write(eq))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ ROTATIONAL MECHANICS
    {
        "topic": "torque_angular_momentum",
        "description": (
            "Rotational mechanics: torque tau = r x F causes angular acceleration alpha = tau/I. "
            "Show a disk rotating with a ValueTracker for angle, an angular velocity label, "
            "a torque arrow (RED) at the rim, moment of inertia and L = I*omega equations."
        ),
        "visual_rules": (
            "Disk: BLUE Circle rotating about ORIGIN. Spoke: BLUE_B line to rim. "
            "Torque arrow: RED Arrow at rim tangent. omega label: GREEN. L label: ORANGE. "
            "Equations: WHITE MathTex at bottom or corner."
        ),
        "manim_code": """\
        import math
        I_val, omega = 2.0, 3.0
        title = Text("Torque and Angular Momentum", font_size=28).to_edge(UP)
        disk  = Circle(radius=1.8, color=BLUE, fill_opacity=0.2, stroke_width=4)
        axle  = Dot(ORIGIN, color=WHITE, radius=0.12)
        angle = ValueTracker(0)
        spoke = always_redraw(lambda: Line(
            ORIGIN,
            1.8 * np.array([math.cos(angle.get_value()), math.sin(angle.get_value()), 0]),
            color=BLUE_B, stroke_width=3
        ))
        dot_rim = always_redraw(lambda: Dot(
            1.8 * np.array([math.cos(angle.get_value()), math.sin(angle.get_value()), 0]),
            color=YELLOW, radius=0.14
        ))
        tau_arrow = Arrow(disk.get_bottom(), disk.get_bottom() + RIGHT * 1.5, color=RED, buff=0)
        tau_lbl   = MathTex(r"\tau = r \times F", font_size=22, color=RED).next_to(tau_arrow, DOWN, buff=0.1)
        om_lbl    = MathTex(r"\omega = 3\,rad/s", font_size=22, color=GREEN).to_corner(UR).shift(DOWN*0.8)
        L_lbl     = MathTex(r"L = I\omega = 6\,kg\cdot m^2/s", font_size=22, color=ORANGE).to_corner(UR).shift(DOWN*1.4)
        eq        = MathTex(r"\alpha = \tau / I", font_size=26, color=WHITE).to_edge(DOWN).shift(UP*0.2)
        self.play(Write(title))
        self.play(Create(disk), FadeIn(axle))
        self.add(spoke, dot_rim)
        self.play(Write(om_lbl), Write(L_lbl), Create(tau_arrow), Write(tau_lbl), Write(eq))
        self.play(angle.animate.set_value(2 * PI), run_time=2, rate_func=linear)
        self.play(angle.animate.set_value(4 * PI), run_time=2, rate_func=linear)
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ CIRCUITS
    {
        "topic": "rc_circuit_charging",
        "description": (
            "RC circuit: capacitor charges exponentially V_C(t) = V0*(1 - e^(-t/RC)). "
            "Plot the charging curve on Axes with a dashed asymptote at V0 and a vertical "
            "dashed line at t = RC (time constant tau). Show equations."
        ),
        "visual_rules": (
            "Axes: standard Manim Axes. Charging curve: GREEN. Asymptote: YELLOW dashed. "
            "Tau line: ORANGE dashed. Labels: WHITE MathTex. Title: WHITE Text at top."
        ),
        "manim_code": """\
        import math
        R, C, V0 = 1000, 0.001, 5.0
        tau_rc = R * C
        t_end  = 5 * tau_rc
        t_data  = [i * t_end / 60 for i in range(61)]
        vc_data = [V0 * (1 - math.exp(-t / tau_rc)) for t in t_data]
        title = Text("RC Circuit Charging", font_size=30).to_edge(UP)
        axes  = Axes(x_range=[0, t_end, tau_rc], y_range=[0, V0 * 1.1, V0 / 4],
                     x_length=7, y_length=3.5).shift(DOWN * 0.3)
        x_lbl = axes.get_x_axis_label(MathTex("t\\,(s)"))
        y_lbl = axes.get_y_axis_label(MathTex("V_C"))
        curve = axes.plot_line_graph(t_data, vc_data, line_color=GREEN, stroke_width=3, add_vertex_dots=False)
        asym  = DashedLine(axes.c2p(0, V0), axes.c2p(t_end, V0), color=YELLOW, stroke_width=1.5)
        eq    = MathTex(r"V_C(t) = V_0(1 - e^{-t/\tau})", font_size=26, color=WHITE).to_edge(DOWN)
        self.play(Write(title))
        self.play(Create(axes), Write(x_lbl), Write(y_lbl))
        self.play(Create(curve, run_time=2.5))
        self.play(Create(asym))
        self.play(Write(eq))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ QUANTUM
    {
        "topic": "particle_in_a_box",
        "description": (
            "Particle in a box (infinite square well): wave function psi_n = A*sin(n*pi*x/L), "
            "energy E_n = n^2 * pi^2 * hbar^2 / (2mL^2). Show wave function and |psi|^2 curves "
            "on Axes between two wall lines. Label quantum number n and energy level."
        ),
        "visual_rules": (
            "Walls: GREY vertical lines. Wave function curve: BLUE. |psi|^2: YELLOW. "
            "Axes: standard Manim. Equations in WHITE MathTex at corner."
        ),
        "manim_code": """\
        import math
        n, L_box = 2, 1.0
        x_data   = [i * L_box / 80 for i in range(81)]
        psi_data = [math.sin(n * math.pi * x / L_box) for x in x_data]
        psi2     = [v**2 for v in psi_data]
        title = Text(f"Particle in a Box  n={n}", font_size=30).to_edge(UP)
        axes  = Axes(x_range=[0, L_box, L_box/4], y_range=[-1.3, 1.3, 0.5],
                     x_length=7, y_length=3.2).shift(DOWN * 0.2)
        wall_l = Line(axes.c2p(0, -1.3), axes.c2p(0, 1.3), color=GREY, stroke_width=6)
        wall_r = Line(axes.c2p(L_box, -1.3), axes.c2p(L_box, 1.3), color=GREY, stroke_width=6)
        psi_curve  = axes.plot_line_graph(x_data, psi_data, line_color=BLUE, stroke_width=3, add_vertex_dots=False)
        psi2_curve = axes.plot_line_graph(x_data, psi2, line_color=YELLOW, stroke_width=2, add_vertex_dots=False)
        psi_lbl  = MathTex(r"\psi_n = A\sin\!\left(\frac{n\pi x}{L}\right)", font_size=22, color=BLUE).to_corner(UR).shift(DOWN*0.8)
        E_lbl    = MathTex(r"E_n = \frac{n^2\pi^2\hbar^2}{2mL^2}", font_size=22, color=GREEN).to_corner(UR).shift(DOWN*1.5)
        un_lbl   = MathTex(r"\Delta x\,\Delta p \geq \hbar/2", font_size=22, color=ORANGE).to_edge(DOWN).shift(UP*0.2)
        self.play(Write(title))
        self.play(Create(axes), Create(wall_l), Create(wall_r))
        self.play(Create(psi_curve, run_time=2))
        self.play(Create(psi2_curve, run_time=1.5))
        self.play(Write(psi_lbl), Write(E_lbl), Write(un_lbl))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ NUCLEAR / DECAY
    {
        "topic": "radioactive_decay",
        "description": (
            "Radioactive decay: N(t) = N0 * e^(-lambda*t) where lambda = ln(2)/t_half. "
            "Plot exponential decay curve on Axes, show half-life dashed lines, "
            "label lambda and half-life. Include the decay equation in MathTex."
        ),
        "visual_rules": (
            "Decay curve: ORANGE. Half-life dashed lines: YELLOW. Asymptote: GREY. "
            "Equation: WHITE. N0 label: GREEN. Half-life label at x-axis: YELLOW MathTex."
        ),
        "manim_code": """\
        import math
        t_half, N0 = 5.0, 1000.0
        lam = math.log(2) / t_half
        t_end = 5 * t_half
        t_data = [i * t_end / 60 for i in range(61)]
        N_data = [N0 * math.exp(-lam * t) for t in t_data]
        title = Text("Radioactive Decay", font_size=30).to_edge(UP)
        axes  = Axes(x_range=[0, t_end, t_half], y_range=[0, N0*1.1, N0/4],
                     x_length=7, y_length=3.5).shift(DOWN * 0.2)
        curve = axes.plot_line_graph(t_data, N_data, line_color=ORANGE, stroke_width=3, add_vertex_dots=False)
        half_h = DashedLine(axes.c2p(0, N0/2), axes.c2p(t_half, N0/2), color=YELLOW, stroke_width=1.5)
        half_v = DashedLine(axes.c2p(t_half, 0), axes.c2p(t_half, N0/2), color=YELLOW, stroke_width=1.5)
        eq     = MathTex(r"N(t) = N_0 e^{-\lambda t}", font_size=26, color=WHITE).to_edge(DOWN)
        lam_l  = MathTex(r"\lambda = \ln 2 / t_{1/2}", font_size=22, color=ORANGE).to_corner(UR).shift(DOWN*0.8)
        self.play(Write(title))
        self.play(Create(axes))
        self.play(Create(curve, run_time=3))
        self.play(Create(half_h), Create(half_v))
        self.play(Write(eq), Write(lam_l))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ DOPPLER EFFECT
    {
        "topic": "doppler_effect",
        "description": (
            "Doppler effect: moving source compresses sound waves in front (higher observed frequency) "
            "and stretches them behind (lower observed frequency). "
            "Show a moving dot as sound source, concentric circles shifted ahead, "
            "and the Doppler formula f' = f * v / (v - vs)."
        ),
        "visual_rules": (
            "Source: ORANGE dot. Wave circles: BLUE, shifted to show compression. "
            "Ahead observer: GREEN dot. Behind observer: RED dot. Formula: WHITE MathTex at bottom."
        ),
        "manim_code": """\
        title = Text("Doppler Effect", font_size=30).to_edge(UP)
        source = Dot(LEFT * 3, color=ORANGE, radius=0.22)
        src_lbl = Text("Source", font_size=18, color=ORANGE).next_to(source, DOWN, buff=0.1)
        v_arrow = Arrow(source.get_center(), source.get_center() + RIGHT * 1.2, color=GREEN, buff=0)
        waves = VGroup(*[
            Circle(radius=r, color=BLUE, stroke_width=1.5, stroke_opacity=0.8).shift(LEFT * 3 + RIGHT * i * 0.25)
            for i, r in enumerate([0.5, 1.0, 1.5, 2.0])
        ])
        obs_ahead  = Dot(RIGHT * 2, color=GREEN, radius=0.18)
        obs_lbl    = Text("Observer", font_size=16, color=GREEN).next_to(obs_ahead, UP)
        eq = MathTex(r"f' = f_0 \frac{v}{v \mp v_s}", font_size=26, color=WHITE).to_edge(DOWN)
        self.play(Write(title))
        self.play(FadeIn(source), Write(src_lbl), Create(v_arrow))
        self.play(Create(waves, run_time=2))
        self.play(FadeIn(obs_ahead), Write(obs_lbl))
        self.play(Write(eq))
        self.play(source.animate.shift(RIGHT * 3.5), v_arrow.animate.shift(RIGHT * 3.5), run_time=2.5, rate_func=linear)
        self.wait(1)""",
    },

    # ------------------------------------------------------------------ DIFFRACTION
    {
        "topic": "double_slit_interference",
        "description": (
            "Young's double slit experiment: two narrow slits produce interference fringes. "
            "Show a barrier with two slits, wave rays going to a screen, and bright/dark fringes. "
            "Label the fringe condition m*lambda = d*sin(theta) and fringe spacing."
        ),
        "visual_rules": (
            "Barrier: GREY rectangle. Slits: BLACK gaps. Wave rays: BLUE and RED lines. "
            "Screen: GREY vertical line on right. Fringes: YELLOW horizontal lines of varying brightness. "
            "Equations: WHITE MathTex at bottom."
        ),
        "manim_code": """\
        title = Text("Double Slit Interference", font_size=28).to_edge(UP)
        barrier = Rectangle(width=0.2, height=4, color=GREY, fill_opacity=0.8).move_to(LEFT * 2.5)
        slit1 = Rectangle(width=0.25, height=0.1, color=BLACK, fill_opacity=1).move_to(LEFT * 2.5 + UP * 0.3)
        slit2 = Rectangle(width=0.25, height=0.1, color=BLACK, fill_opacity=1).move_to(LEFT * 2.5 + DOWN * 0.3)
        screen = Line(RIGHT * 2.5 + UP * 2, RIGHT * 2.5 + DOWN * 2, color=GREY, stroke_width=5)
        fringes = VGroup(*[
            Line(RIGHT * 2.5 + UP * (i * 0.32) + UP * 0.12,
                 RIGHT * 2.5 + UP * (i * 0.32) + DOWN * 0.12,
                 color=YELLOW, stroke_width=4,
                 stroke_opacity=max(0.1, 1 - 0.18 * abs(i)))
            for i in range(-4, 5)
        ])
        ray1 = Line(LEFT * 2.5 + UP * 0.3, RIGHT * 2.5, color=BLUE, stroke_width=1.5, stroke_opacity=0.5)
        ray2 = Line(LEFT * 2.5 + DOWN * 0.3, RIGHT * 2.5, color=RED, stroke_width=1.5, stroke_opacity=0.5)
        eq   = MathTex(r"m\lambda = d\sin\theta", font_size=26, color=WHITE).to_edge(DOWN)
        self.play(Write(title))
        self.play(Create(barrier), FadeIn(slit1), FadeIn(slit2), Create(screen))
        self.play(Create(ray1), Create(ray2))
        self.play(Create(fringes, run_time=2))
        self.play(Write(eq))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ RELATIVITY
    {
        "topic": "time_dilation_lorentz",
        "description": (
            "Special relativity: time dilation t' = gamma*t, length contraction L' = L/gamma. "
            "gamma = 1/sqrt(1 - v^2/c^2). Plot gamma vs v/c on Axes, show a point for a "
            "specific velocity, and display all three equations."
        ),
        "visual_rules": (
            "Gamma curve: BLUE. Data point: RED dot. Dashed lines: YELLOW. "
            "Gamma equation: BLUE MathTex. Time dilation: GREEN. Length contraction: ORANGE. "
            "Title: WHITE at top."
        ),
        "manim_code": """\
        import math
        beta, gamma_val = 0.8, 1.667
        betas  = [i / 80 for i in range(80)]
        gammas = [1 / max(math.sqrt(1 - b**2), 1e-9) for b in betas]
        title = Text("Special Relativity: Time Dilation", font_size=26).to_edge(UP)
        axes  = Axes(x_range=[0, 1, 0.2], y_range=[1, 6, 1], x_length=6, y_length=3.5).shift(LEFT * 0.5 + DOWN * 0.2)
        x_lbl = axes.get_x_axis_label(MathTex("v/c"))
        y_lbl = axes.get_y_axis_label(MathTex("\\gamma"))
        curve = axes.plot_line_graph(betas, gammas, line_color=BLUE, stroke_width=3, add_vertex_dots=False)
        pt    = Dot(axes.c2p(beta, gamma_val), color=RED, radius=0.12)
        h_ln  = DashedLine(axes.c2p(0, gamma_val), axes.c2p(beta, gamma_val), color=YELLOW, stroke_width=1.5)
        v_ln  = DashedLine(axes.c2p(beta, 1), axes.c2p(beta, gamma_val), color=YELLOW, stroke_width=1.5)
        eq_g  = MathTex(r"\gamma = \frac{1}{\sqrt{1-v^2/c^2}}", font_size=22, color=BLUE).to_corner(UR).shift(DOWN*0.8)
        eq_t  = MathTex(r"\Delta t' = \gamma\Delta t", font_size=22, color=GREEN).to_corner(UR).shift(DOWN*1.5)
        eq_l  = MathTex(r"L' = L/\gamma", font_size=22, color=ORANGE).to_corner(UR).shift(DOWN*2.1)
        val_lbl = MathTex(r"v=0.8c \Rightarrow \gamma=1.67", font_size=20, color=RED).to_edge(DOWN)
        self.play(Write(title))
        self.play(Create(axes), Write(x_lbl), Write(y_lbl))
        self.play(Create(curve, run_time=2))
        self.play(FadeIn(pt), Create(h_ln), Create(v_ln))
        self.play(Write(eq_g), Write(eq_t), Write(eq_l), Write(val_lbl))
        self.wait(2)""",
    },

    # ------------------------------------------------------------------ BERNOULLI PRINCIPLE
    {
        "topic": "bernoulli_equation",
        "description": (
            "Bernoulli principle: P + 0.5*rho*v^2 + rho*g*h = constant for ideal fluid flow. "
            "Show a pipe narrowing (venturi), with wide slow flow and narrow fast flow, "
            "pressure arrows showing higher pressure in wide section."
        ),
        "visual_rules": (
            "Pipe walls: GREY. Fluid flow: BLUE arrows. Speed labels: GREEN. "
            "Pressure labels: RED. Equations: WHITE MathTex at bottom."
        ),
        "manim_code": """\
        title = Text("Bernoulli's Principle", font_size=28).to_edge(UP)
        pipe = VGroup(
            Line(LEFT*4+UP*1, LEFT*0.5+UP*1, color=GREY, stroke_width=3),
            Line(LEFT*0.5+UP*1, RIGHT*0.5+UP*0.35, color=GREY, stroke_width=3),
            Line(RIGHT*0.5+UP*0.35, RIGHT*4+UP*0.35, color=GREY, stroke_width=3),
            Line(LEFT*4+DOWN*1, LEFT*0.5+DOWN*1, color=GREY, stroke_width=3),
            Line(LEFT*0.5+DOWN*1, RIGHT*0.5+DOWN*0.35, color=GREY, stroke_width=3),
            Line(RIGHT*0.5+DOWN*0.35, RIGHT*4+DOWN*0.35, color=GREY, stroke_width=3),
        )
        flow_l = VGroup(*[Arrow(LEFT*(3-i*0.8), LEFT*(2.2-i*0.8), color=BLUE, buff=0, stroke_width=2) for i in range(3)])
        flow_r = VGroup(*[Arrow(RIGHT*(1+i*0.8), RIGHT*(1.8+i*0.8), color=BLUE, buff=0, stroke_width=3) for i in range(3)])
        v_slow = MathTex(r"v_1\,\mathrm{slow}", font_size=20, color=GREEN).move_to(LEFT*2.5+DOWN*1.3)
        v_fast = MathTex(r"v_2\,\mathrm{fast}", font_size=20, color=GREEN).move_to(RIGHT*2.5+DOWN*0.65)
        P_high = Text("P1 high", font_size=18, color=RED).move_to(LEFT*2.5+UP*1.3)
        P_low  = Text("P2 low", font_size=18, color=RED).move_to(RIGHT*2.5+UP*0.65)
        eq = MathTex(r"P+\tfrac{1}{2}\rho v^2+\rho g h=\mathrm{const}", font_size=24, color=WHITE).to_edge(DOWN)
        self.play(Write(title))
        self.play(Create(pipe))
        self.play(Create(flow_l), Create(flow_r))
        self.play(Write(v_slow), Write(v_fast), Write(P_high), Write(P_low))
        self.play(Write(eq))
        self.wait(2)""",
    },

]
