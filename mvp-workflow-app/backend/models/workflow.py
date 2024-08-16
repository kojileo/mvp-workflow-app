from pydantic import BaseModel
from typing import List, Literal

class Input(BaseModel):
    name: str
    type: str

class Output(BaseModel):
    name: str
    type: str

class Step(BaseModel):
    name: str
    description: str
    command: str
    inputs: List[Input]
    outputs: List[Output]
    dependencies: List[str]
    status: Literal['保留中', '実行中', '完了', '失敗']
    processing_time: Literal['短', '中', '長']

class Workflow(BaseModel):
    name: str
    description: str
    steps: List[Step]