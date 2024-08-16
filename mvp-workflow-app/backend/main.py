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
    type: str
    description: str
    required: Optional[bool] = None  # requiredフィールドをオプションに変更
    default: Optional[str] = None
    value: Optional[str] = None

class Node(BaseModel):
    nodeName: str
    nodeType: str
    nodeParameter: List[dict]
    entryPoint: Union[bool, str]

class Edge(BaseModel):
    edgeType: str
    edgeFrom: str
    edgeTo: Union[str, List[str]]

class FlowItem(BaseModel):
    node: Optional[Node] = None
    edge: Optional[Edge] = None

class CreateApiRequest(BaseModel):
    apiEndPoint: str
    description: str
    apiType: str
    apiRequestParameters: List[Parameter]
    apiRequestHeaders: List[Header]
    apiRequestBody: List[dict]
    apiResponseHeaders: List[Header]
    apiResponseBody: List[dict]
    flow: List[FlowItem]

    class Config:
        extra = 'allow'  # 未知のフィールドを許可

@app.post("/createapi")
async def create_api(request: CreateApiRequest):
    try:
        logger.debug(f"Received request: {json.dumps(request.dict(), indent=2)}")
        # ここでリクエストを処理
        return {
            "message": "API created successfully",
            "apiEndPoint": request.apiEndPoint
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