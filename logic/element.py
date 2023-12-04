import csv
import random


class Element:
    def __init__(self, symbol: str, name: str, deficiency: int, electrons: int, state: str, salt: str, molecule: int) -> None:
        """
        Initialize an Element object.

        Parameters:
        - symbol (str): The chemical symbol.
        - name (str): The name of the element.
        - deficiency (int): The amount of electrons to the full/empty last electron shell.
        - electrons (int): The total number of electrons.
        - state (str): The state of the element (should be "M" or "N").
        - salt (str): The salt name formed by the element.
        - molecule (int): The amount of atoms in the molecule.

        Returns:
        None
        """
        self.symbol = symbol
        self.name = name
        self.deficiency = int(deficiency)
        self.electrons = int(electrons)
        self.state = state
        self.salt = salt
        self.molecule = int(molecule)

    def get_info(self) -> dict:
        """
        Get information about the Element.

        Returns:
        dict: A dictionary containing all properties of the Element.
        """
        return vars(self)



class Display:
    def __init__(self, element: Element, before: int = 1, after_up_number: int = 1, after_up_symbol: str = '', after_down: int = 1) -> None:
        """
        Initialize a Display object.

        Parameters:
        - element (Elements: The chemical symbol.
        - before (int): The number displayed before the symbol.
        - after_up_number (int): The number displayed after and abow the symbol.
        - after_up_symbol (str): The special symbol displayed after and abow the symbol.
        - after_down (int): The number displayed after and under the symbol.

        Returns:
        None
        """
        self.element = element

        self.symbol = self.element.symbol
        self.before = before
        self.after_up_number = after_up_number
        self.after_up_symbol = after_up_symbol
        self.after_down = after_down

    def display(self) -> str:
        """
        Display the information in the html code
        
        Returns:
        str: An html code displaying the information.
        """

        before = f'{self.before if self.before != 1 else ""}'
        symbol = f'{self.symbol}'
        after_up = f'<span class="up">{self.after_up_number if self.after_up_number != 1 else ""}{self.after_up_symbol}</span>'
        after_down = f'<span class="down">{self.after_down if self.after_down != 1 else ""}</span>'

        return before + symbol + after_up + after_down

class ElectronElement(Element):
    def __init__(self) -> None:
        self.symbol = '<i>e</i>'

class ElectronDisplay(Display):
    def __init__(self, before: 1) -> None:
        super().__init__(ElectronElement(), before= before, after_up_symbol= '&#8722')


def load_elements(storage: str) -> list[Element]:
    elements = list()

    with open(storage, newline="", encoding="utf-8") as csvfile:
        
        reader = csv.reader(csvfile)
        next(reader)
        
        for row in reader:
            elements.append(Element(*row))
    
    return elements

def random_elements(elements: list[Element]) -> dict:
    return {'metall': random.choice([element.get_info() for element in elements if element.state == "M"]), 
            'nichtmetall': random.choice([element.get_info() for element in elements if element.state == "N"])}
