from dataclasses import dataclass , field

@dataclass
class SpamInput:
    name: str
    email:str
    subject:str
    message:str
    
@dataclass
class SpamResult:
    score  : int
    status : str
    