from manim import *
import numpy as np

class BarMagnetField(Scene):
    def construct(self):
        title = Text("Magnetic Field of a Bar Magnet").scale(0.8).to_edge(UP)
        self.play(Write(title))
        
        # Draw Magnet
        magnet = VGroup()
        north_pole = Rectangle(width=2, height=1, fill_color=RED, fill_opacity=0.8, color=WHITE).shift(LEFT)
        south_pole = Rectangle(width=2, height=1, fill_color=BLUE, fill_opacity=0.8, color=WHITE).shift(RIGHT)
        n_label = Text("N", color=WHITE).move_to(north_pole)
        s_label = Text("S", color=WHITE).move_to(south_pole)
        magnet.add(north_pole, south_pole, n_label, s_label)
        
        self.play(FadeIn(magnet))
        self.wait(1)
        
        # Magnetic Field Lines
        def magnetic_field_func(pos):
            # Dipole field approximation
            x, y = pos[0], pos[1]
            r1 = np.array([x + 1, y, 0]) # relative to North
            r2 = np.array([x - 1, y, 0]) # relative to South
            dist1 = np.linalg.norm(r1)
            dist2 = np.linalg.norm(r2)
            
            if dist1 < 0.2 or dist2 < 0.2:
                return np.array([0, 0, 0])
                
            B1 = r1 / (dist1**3)
            B2 = -r2 / (dist2**3)
            B = B1 + B2
            
            # Normalize vector field for arrow length consistency
            norm = np.linalg.norm(B)
            if norm == 0:
                return np.array([0, 0, 0])
            return B / norm * 0.5
            
        vector_field = ArrowVectorField(
            magnetic_field_func,
            x_range=[-5, 5, 0.5],
            y_range=[-3, 3, 0.5],
            colors=[BLUE, YELLOW, RED],
            opacity=0.6
        )
        
        # Stream lines (continuous passing lines)
        stream_lines = StreamLines(
            magnetic_field_func, 
            stroke_width=2, 
            max_anchors_per_line=30,
            x_range=[-5, 5, 0.4],
            y_range=[-3, 3, 0.4],
        )

        explanation = Text("Lines flow from North (N) to South (S)").scale(0.6).to_edge(DOWN)
        
        self.play(Create(vector_field))
        self.play(Write(explanation))
        self.wait(2)
        
        self.play(FadeOut(vector_field))
        self.add(stream_lines)
        stream_lines.start_animation(warm_up=False, flow_speed=1.5)
        self.wait(4)
        
        self.play(FadeOut(stream_lines), FadeOut(magnet), FadeOut(title), FadeOut(explanation))

class StraightWireField(Scene):
    def construct(self):
        title = Text("Magnetic Field Around a Straight Wire").scale(0.8).to_edge(UP)
        self.play(Write(title))
        
        # Draw wire
        wire = Cylinder(radius=0.1, height=4, direction=UP, fill_color=GRAY, fill_opacity=0.8, color=WHITE)
        self.play(FadeIn(wire))
        
        # Current direction
        cur_arrow = Arrow(start=DOWN * 2, end=UP * 2, color=YELLOW, buff=0)
        cur_label = Text("Current (I)", color=YELLOW).scale(0.5).next_to(cur_arrow, RIGHT)
        self.play(GrowArrow(cur_arrow), Write(cur_label))
        
        # Right hand rule
        rule_text = Text("Right-Hand Grip Rule:\nThumb = Current\nFingers = Magnetic Field").scale(0.5).to_corner(UL)
        self.play(Write(rule_text))
        self.wait(1)
        
        # Magnetic Field Circles
        field_circles = VGroup()
        for r in [1, 1.5, 2]:
            circle = Circle(radius=r, color=BLUE).rotate(PI/2, axis=RIGHT)
            # Add arrows to indicate direction (counter-clockwise from top view)
            arrow1 = Triangle(color=BLUE, fill_opacity=1).scale(0.1).move_to(circle.point_at_angle(0)).rotate(PI/2, axis=UP).rotate(PI/2, axis=RIGHT)
            arrow2 = Triangle(color=BLUE, fill_opacity=1).scale(0.1).move_to(circle.point_at_angle(PI)).rotate(-PI/2, axis=UP).rotate(PI/2, axis=RIGHT)
            field_circles.add(VGroup(circle, arrow1, arrow2))
            
        self.play(Create(field_circles))
        
        # 3D rotation effect text
        note = Text("Perspective: Top-down view is counter-clockwise").scale(0.6).to_edge(DOWN)
        self.play(Write(note))
        self.wait(3)
        
        self.play(
            *[FadeOut(m) for m in self.mobjects]
        )

class CoiledWireField(Scene):
    def construct(self):
        title = Text("Magnetic Field of a Coiled Wire (Solenoid)").scale(0.8).to_edge(UP)
        self.play(Write(title))
        
        # Draw coil
        coil = ParametricFunction(
            lambda t: np.array([t, 0.5 * np.sin(10 * t), 0.5 * np.cos(10 * t)]),
            t_range=np.array([-2.5, 2.5]),
            color=ORANGE, stroke_width=4
        )
        self.play(Create(coil))
        
        # Current direction
        cur_in = Arrow(LEFT * 3.5, LEFT * 2.5, color=YELLOW)
        cur_out = Arrow(RIGHT * 2.5, RIGHT * 3.5, color=YELLOW)
        lbl_I = Text("I", color=YELLOW).scale(0.5)
        lbl_I_in = lbl_I.copy().next_to(cur_in, UP)
        lbl_I_out = lbl_I.copy().next_to(cur_out, UP)
        
        self.play(GrowArrow(cur_in), Write(lbl_I_in), GrowArrow(cur_out), Write(lbl_I_out))
        
        # Right hand rule
        rule_text = Text("Right-Hand Thumb Rule (Coil):\nFingers curl = Current\nThumb = North Pole (Field dir inside)").scale(0.5).to_corner(UL)
        self.play(Write(rule_text))
        
        # Magnetic Field inside
        b_arrow = Arrow(LEFT*3, RIGHT*3, color=BLUE, stroke_width=6)
        b_label = Text("B-Field", color=BLUE).scale(0.5).next_to(b_arrow, DOWN)
        self.play(GrowArrow(b_arrow), Write(b_label))
        
        # Field lines outside
        b_loop1 = ArcBetweenPoints(RIGHT*2.5 + UP*0.8, LEFT*2.5 + UP*0.8, radius=3, color=BLUE)
        b_loop2 = ArcBetweenPoints(RIGHT*2.5 + DOWN*0.8, LEFT*2.5 + DOWN*0.8, radius=-3, color=BLUE)
        
        arr_tp = Arrow(ORIGIN, LEFT*0.01, color=BLUE).move_to(b_loop1.point_at_angle(PI/2))
        arr_bt = Arrow(ORIGIN, LEFT*0.01, color=BLUE).move_to(b_loop2.point_at_angle(-PI/2))

        self.play(Create(b_loop1), Create(b_loop2), FadeIn(arr_tp), FadeIn(arr_bt))
        
        n_pole = Text("N", color=RED).scale(0.8).next_to(coil, RIGHT, buff=0.5)
        s_pole = Text("S", color=BLUE).scale(0.8).next_to(coil, LEFT, buff=0.5)
        self.play(Write(n_pole), Write(s_pole))
        
        self.wait(3)
        self.play(*[FadeOut(m) for m in self.mobjects])

class LorentzForce(Scene):
    def construct(self):
        title = Text("Lorentz Force on a Moving Charge/Wire").scale(0.8).to_edge(UP)
        self.play(Write(title))
        
        # Draw Magnetic Field B (into the screen = X symbols)
        b_group = VGroup()
        for x in np.linspace(-3, 3, 5):
            for y in np.linspace(-1.5, 1.5, 3):
                cross = VGroup(Line(UP*0.2+LEFT*0.2, DOWN*0.2+RIGHT*0.2), Line(UP*0.2+RIGHT*0.2, DOWN*0.2+LEFT*0.2)).set_color(BLUE).move_to([x, y, 0])
                b_group.add(cross)
                
        b_label = Text("B-field (Into screen)", color=BLUE).scale(0.5).to_corner(UR)
        self.play(FadeIn(b_group), Write(b_label))
        
        # Draw Wire/Charge
        wire = Line(DOWN*2.5, UP*2.5, color=GRAY, stroke_width=8)
        self.play(Create(wire))
        
        # Current Direction
        cur_arrow = Arrow(DOWN*1.5, UP*1.5, color=YELLOW, buff=0).shift(LEFT*0.5)
        cur_label = Text("Current (I)", color=YELLOW).scale(0.5).next_to(cur_arrow, LEFT)
        self.play(GrowArrow(cur_arrow), Write(cur_label))
        
        # Right hand rule explanation
        rule_bg = Rectangle(width=6, height=1.5, color=WHITE, fill_color=BLACK, fill_opacity=0.8).to_corner(DL)
        rule_text = Text("Fleming's Left-Hand Rule / Right-Hand Slap:\nIndex/Fingers = B-Field\nMiddle/Thumb = Current\nThumb/Palm = Force (F)").scale(0.4).move_to(rule_bg)
        self.play(FadeIn(rule_bg), Write(rule_text))
        
        # Lorentz Force Arrow
        force_arrow = Arrow(ORIGIN, LEFT*2.5, color=RED).shift(UP*0.5)
        force_label = Text("Force (F)", color=RED).scale(0.6).next_to(force_arrow, UP)
        
        self.wait(1)
        self.play(GrowArrow(force_arrow), Write(force_label))
        
        # Emphasize perpendicularity
        angle1 = RightAngle(cur_arrow, force_arrow, quadrant=(-1,-1), color=WHITE, length=0.3)
        self.play(Create(angle1))
        
        f_eq = MathTex("F = I \\times B \\times L \\sin(\\theta)").scale(0.8).to_edge(DOWN)
        self.play(Write(f_eq))
        
        self.wait(4)
