from manim import *
import random

class CircuitComparison(Scene):
    def construct(self):
        title = Text("Volt, Ampere, and Watt in Circuits").scale(0.8).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Generate Random Values for Series
        V_s = float(random.choice([12, 24]))
        R1_s = float(random.choice([2, 4, 6]))
        R2_s = float(random.choice([2, 4, 6]))
        I_s = V_s / (R1_s + R2_s)
        V1_s = I_s * R1_s
        V2_s = I_s * R2_s
        W1_s = V1_s * I_s
        W2_s = V2_s * I_s
        Wt_s = V_s * I_s

        series_group = VGroup()
        
        # Draw Series Circuit
        # Battery Left
        bat_line1 = Line([-3.3, 0.2, 0], [-2.7, 0.2, 0], color=GREEN) # Positive (Long)
        bat_line2 = Line([-3.1, -0.2, 0], [-2.9, -0.2, 0], color=RED) # Negative (Short)
        plus_sym = Text("+", color=GREEN).scale(0.5).next_to(bat_line1, UP, buff=0.1)
        minus_sym = Text("-", color=RED).scale(0.5).next_to(bat_line2, DOWN, buff=0.1)
        
        wire_l1 = Line([-3, 0.2, 0], [-3, 1.5, 0])
        wire_l2 = Line([-3, -0.2, 0], [-3, -1.5, 0])

        # Top wire & Resistor 1
        wire_t1 = Line([-3, 1.5, 0], [-0.5, 1.5, 0])
        resistor1 = Rectangle(height=0.4, width=1.0, color=BLUE).move_to([0, 1.5, 0])
        r1_label = Text(f"R1 ({R1_s:.0f} Ohm)").scale(0.4).next_to(resistor1, UP)
        wire_t2 = Line([0.5, 1.5, 0], [3, 1.5, 0])

        # Right wire & Resistor 2
        wire_r1 = Line([3, 1.5, 0], [3, 0.5, 0])
        resistor2 = Rectangle(height=1.0, width=0.4, color=BLUE).move_to([3, 0, 0])
        r2_label = Text(f"R2 ({R2_s:.0f} Ohm)").scale(0.4).next_to(resistor2, RIGHT)
        wire_r2 = Line([3, -0.5, 0], [3, -1.5, 0])

        # Bottom wire
        wire_b = Line([3, -1.5, 0], [-3, -1.5, 0])

        circuit_series = VGroup(
            wire_l1, wire_l2, bat_line1, bat_line2, plus_sym, minus_sym,
            wire_t1, resistor1, r1_label, wire_t2,
            wire_r1, resistor2, r2_label, wire_r2,
            wire_b
        )
        circuit_series.shift(LEFT * 2.5 + DOWN * 0.5) # Shift left to make room for equations and down to avoid title

        series_title = Text("Series Circuit: Voltage is Divided").scale(0.6).next_to(circuit_series, UP, buff=0.5)

        # Equations Series
        eq_s_1 = Text(f"Voltage (V): {V_s:.0f} V")
        eq_s_2 = Text(f"Current (I): {I_s:.1f} A")
        eq_s_3 = Text(f"R1: {V1_s:.1f} V, {W1_s:.1f} W", color=YELLOW)
        eq_s_4 = Text(f"R2: {V2_s:.1f} V, {W2_s:.1f} W", color=YELLOW)
        eq_s_5 = Text(f"Total Power: {Wt_s:.1f} W", color=ORANGE)
        
        eq_s_group = VGroup(eq_s_1, eq_s_2, eq_s_3, eq_s_4, eq_s_5).arrange(DOWN, aligned_edge=LEFT).scale(0.5).next_to(circuit_series, RIGHT, buff=0.5)

        self.play(FadeIn(series_title))
        self.play(Create(circuit_series))
        self.play(Write(eq_s_group))

        # Electron flow for Series
        def create_path(points):
            p = VMobject()
            p.set_points_as_corners(points)
            return p
        
        # Shift path by the same amount as circuit
        shift_vec = LEFT * 2.5 + DOWN * 0.5
        pts_s = [
            [-3, 0.2, 0], [-3, 1.5, 0], [3, 1.5, 0], [3, -1.5, 0], [-3, -1.5, 0], [-3, -0.2, 0]
        ]
        pts_s = [[x + shift_vec[0], y + shift_vec[1], z + shift_vec[2]] for x, y, z in pts_s]
        
        path_s = create_path(pts_s)
        
        electrons_s = VGroup(*[Dot(radius=0.06, color=YELLOW) for _ in range(15)])
        for i, e in enumerate(electrons_s):
            e.alpha = i / 15
            e.move_to(path_s.point_from_proportion(e.alpha))
            
            # Using function factory to bind correctly
            def make_updater(p):
                def updater(mob, dt):
                    mob.alpha = (mob.alpha + dt * 0.2) % 1.0
                    mob.move_to(p.point_from_proportion(mob.alpha))
                return updater
            
            e.add_updater(make_updater(path_s))
            
        self.add(electrons_s)
        self.wait(6)

        for e in electrons_s:
            e.clear_updaters()
        
        self.play(
            FadeOut(circuit_series), FadeOut(eq_s_group), FadeOut(series_title), FadeOut(electrons_s)
        )

        # PARALLEL CIRCUIT
        V_p = float(random.choice([12, 24]))
        R1_p = float(random.choice([3, 6, 12]))
        R2_p = float(random.choice([3, 6, 12]))
        V1_p = V_p
        V2_p = V_p
        I1_p = V_p / R1_p
        I2_p = V_p / R2_p
        I_p = I1_p + I2_p
        W1_p = V1_p * I1_p
        W2_p = V2_p * I2_p
        Wt_p = V_p * I_p

        bat_line1_p = Line([-3.3, 0.2, 0], [-2.7, 0.2, 0], color=GREEN)
        bat_line2_p = Line([-3.1, -0.2, 0], [-2.9, -0.2, 0], color=RED)
        plus_sym_p = Text("+", color=GREEN).scale(0.5).next_to(bat_line1_p, UP, buff=0.1)
        minus_sym_p = Text("-", color=RED).scale(0.5).next_to(bat_line2_p, DOWN, buff=0.1)
        wire_l1_p = Line([-3, 0.2, 0], [-3, 2, 0])
        wire_l2_p = Line([-3, -0.2, 0], [-3, -2, 0])

        wire_t_p = Line([-3, 2, 0], [2, 2, 0])
        wire_b_p = Line([-3, -2, 0], [2, -2, 0])

        wire_b1_t = Line([-1, 2, 0], [-1, 0.5, 0])
        resistor1_p = Rectangle(height=1.0, width=0.4, color=BLUE).move_to([-1, 0, 0])
        r1_p_label = Text(f"R1 ({R1_p:.0f} Ohm)").scale(0.4).next_to(resistor1_p, RIGHT)
        wire_b1_b = Line([-1, -0.5, 0], [-1, -2, 0])

        wire_b2_t = Line([2, 2, 0], [2, 0.5, 0])
        resistor2_p = Rectangle(height=1.0, width=0.4, color=BLUE).move_to([2, 0, 0])
        r2_p_label = Text(f"R2 ({R2_p:.0f} Ohm)").scale(0.4).next_to(resistor2_p, RIGHT)
        wire_b2_b = Line([2, -0.5, 0], [2, -2, 0])

        circuit_parallel = VGroup(
            bat_line1_p, bat_line2_p, plus_sym_p, minus_sym_p,
            wire_l1_p, wire_l2_p, wire_t_p, wire_b_p,
            wire_b1_t, resistor1_p, r1_p_label, wire_b1_b,
            wire_b2_t, resistor2_p, r2_p_label, wire_b2_b,
            Dot([-1, 2, 0], radius=0.08, color=WHITE),
            Dot([-1, -2, 0], radius=0.08, color=WHITE)
        )
        circuit_parallel.shift(LEFT * 2.5 + DOWN * 0.5)

        parallel_title = Text("Parallel Circuit: Current is Divided").scale(0.6).next_to(circuit_parallel, UP, buff=0.5)

        eq_p_1 = Text(f"Voltage (V): {V_p:.0f} V")
        eq_p_2 = Text(f"Total Current (I): {I_p:.1f} A")
        eq_p_3 = Text(f"R1: {I1_p:.1f} A, {W1_p:.1f} W", color=YELLOW)
        eq_p_4 = Text(f"R2: {I2_p:.1f} A, {W2_p:.1f} W", color=YELLOW)
        eq_p_5 = Text(f"Total Power: {Wt_p:.1f} W", color=ORANGE)

        eq_p_group = VGroup(eq_p_1, eq_p_2, eq_p_3, eq_p_4, eq_p_5).arrange(DOWN, aligned_edge=LEFT).scale(0.5).next_to(circuit_parallel, RIGHT, buff=0.5)

        self.play(FadeIn(parallel_title))
        self.play(Create(circuit_parallel))
        self.play(Write(eq_p_group))

        pts_p1 = [
            [-3, 0.2, 0], [-3, 2, 0], [-1, 2, 0], [-1, -2, 0], [-3, -2, 0], [-3, -0.2, 0]
        ]
        pts_p2 = [
            [-3, 0.2, 0], [-3, 2, 0], [2, 2, 0], [2, -2, 0], [-3, -2, 0], [-3, -0.2, 0]
        ]
        
        # Shift path by the same amount as parallel circuit
        shift_vec_p = LEFT * 2.5 + DOWN * 0.5
        pts_p1 = [[x + shift_vec_p[0], y + shift_vec_p[1], z + shift_vec_p[2]] for x, y, z in pts_p1]
        pts_p2 = [[x + shift_vec_p[0], y + shift_vec_p[1], z + shift_vec_p[2]] for x, y, z in pts_p2]

        path_p1 = create_path(pts_p1)
        path_p2 = create_path(pts_p2)

        speed1 = 0.2 * (I1_p / (I1_p + I2_p)) + 0.1
        speed2 = 0.2 * (I2_p / (I1_p + I2_p)) + 0.1

        num_e1 = max(3, int(15 * I1_p / I_p))
        num_e2 = max(3, int(15 * I2_p / I_p))

        electrons_p1 = VGroup(*[Dot(radius=0.06, color=YELLOW) for _ in range(num_e1)])
        electrons_p2 = VGroup(*[Dot(radius=0.06, color=YELLOW) for _ in range(num_e2)])

        for i, e in enumerate(electrons_p1):
            e.alpha = i / num_e1
            e.move_to(path_p1.point_from_proportion(e.alpha))
            def make_updater(p, sp):
                def updater(mob, dt):
                    mob.alpha = (mob.alpha + dt * sp) % 1.0
                    mob.move_to(p.point_from_proportion(mob.alpha))
                return updater
            e.add_updater(make_updater(path_p1, speed1))

        for i, e in enumerate(electrons_p2):
            e.alpha = i / num_e2
            e.move_to(path_p2.point_from_proportion(e.alpha))
            def make_updater(p, sp):
                def updater(mob, dt):
                    mob.alpha = (mob.alpha + dt * sp) % 1.0
                    mob.move_to(p.point_from_proportion(mob.alpha))
                return updater
            e.add_updater(make_updater(path_p2, speed2))

        self.add(electrons_p1, electrons_p2)
        self.wait(6)

        for e in electrons_p1: e.clear_updaters()
        for e in electrons_p2: e.clear_updaters()

        self.play(FadeOut(circuit_parallel), FadeOut(eq_p_group), FadeOut(parallel_title), FadeOut(electrons_p1), FadeOut(electrons_p2))

        conclusion1 = Text("Series: Voltage divides, Current is same").scale(0.8)
        conclusion2 = Text("Parallel: Current divides, Voltage is same").scale(0.8).next_to(conclusion1, DOWN)
        self.play(Write(conclusion1), Write(conclusion2))
        self.wait(3)

