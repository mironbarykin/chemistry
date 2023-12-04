from element import Display, Element

class Reaction:
    def __init__(self, left: list[Display], right: list[Display]) -> None:
        self.left = left
        self.right = right

    def display(self) -> str:
        left = ' + '.join([dis.display() for dis in self.left])
        right = ' + '.join([dis.display() for dis in self.right])
        return left, ' &#10230 ', right


class RedOx(Reaction):
    def __init__(self, metal: Element, nonmetal: Element) -> None:
        pass
        # super().__init__([], [])
    
    def generate():
        # return the result of redox in html
        pass