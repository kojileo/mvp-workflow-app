from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import List, Optional, Union
import logging
import json

app = FastAPI()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Parameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool
    default: Optional[Union[str, int]] = None

class Header(BaseModel):
    name: str
    value: str

class BodyItem(BaseModel):
    name: str
    value: Union[str, int]

class NodeParameter(BaseModel):
    nodeName: str
    nodeType: str
    nodeParameter: dict
    entryPoint: bool

class Workflow(BaseModel):
    apiEndPoint: str
    description: str
    apiType: str
    apiRequestParameters: List[Parameter] = []
    apiRequestHeaders: List[Header] = []
    apiRequestBody: List[BodyItem] = []
    apiResponseHeaders: List[Header] = []
    apiResponseBody: List[BodyItem] = []
    flow: List[dict]

class CreateApiRequest(BaseModel):
    workflow: Workflow

    class Config:
        extra = 'allow'  # 未知のフィールドを許可

@app.post("/createapi")
async def create_api(request: CreateApiRequest):
    try:
        logger.debug(f"Received request: {json.dumps(request.dict(), indent=2)}")
        workflow = request.workflow
        
        # ワークフローの処理をここに実装
        # 例: ワークフローの各ステップを実行
        
        return {
            "message": "API created successfully",
            "apiEndPoint": workflow.apiEndPoint
        }
    except ValidationError as e:
        logger.error(f"Validation error: {e.json()}")
        raise HTTPException(status_code=422, detail=json.loads(e.json()))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)