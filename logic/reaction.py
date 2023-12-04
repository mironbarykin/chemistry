from logic.element import Display, Element, ElectronDisplay

class Reaction:
    def __init__(self, left: list[Display], right: list[Display]) -> None:
        self.left = left
        self.right = right

    def display(self) -> str:
        left = ' + '.join([dis.display() for dis in self.left])
        right = ' + '.join([dis.display() for dis in self.right])
        return left + ' &#10230 '+ right


class RedOx(Reaction):
    def __init__(self, metal: Element, nonmetal: Element) -> None:
        self.metal = metal
        self.nonmetal = nonmetal
    
    def generate(self) -> tuple:
        
        electrons_right = ElectronDisplay(before=self.metal.deficiency)
        oxidation = Reaction([Display(self.metal, after_down=self.metal.molecule), electrons_right], 
                             [Display(self.metal, after_up_number=self.metal.deficiency, after_up_symbol='+')])
        
        electrons_left = ElectronDisplay(before=self.nonmetal.deficiency * self.nonmetal.molecule)
        reduktion = Reaction([Display(self.nonmetal, after_down=self.nonmetal.molecule), electrons_left], 
                             [Display(self.nonmetal, before=self.nonmetal.molecule, after_up_number=self.nonmetal.deficiency, after_up_symbol='&#8722')])

        if electrons_left.before != electrons_right.before:
            oxidation.left[0].before *= electrons_left.before
            oxidation.right[0].before *= electrons_left.before

            reduktion.left[0].before *= electrons_right.before
            reduktion.right[0].before *= electrons_right.before


        redox = Reaction([oxidation.left[0], reduktion.left[0]], [oxidation.right[0], reduktion.right[0]])        
        
        return oxidation, reduktion, redox
