from ..models.workflow import Workflow
from ..utils.workflow_executor import WorkflowExecutor
from typing import List, Optional
import uuid

class WorkflowService:
    def __init__(self):
        self.workflows = {}

    async def create_workflow(self, workflow: Workflow) -> Workflow:
        workflow_id = str(uuid.uuid4())
        self.workflows[workflow_id] = workflow
        
        # ワークフローを実行
        await WorkflowExecutor.execute_workflow(workflow)
        
        return workflow

    async def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        return self.workflows.get(workflow_id)

    async def list_workflows(self) -> List[Workflow]:
        return list(self.workflows.values())

    async def update_workflow(self, workflow_id: str, workflow: Workflow) -> Optional[Workflow]:
        if workflow_id in self.workflows:
            self.workflows[workflow_id] = workflow
            return workflow
        return None

    async def delete_workflow(self, workflow_id: str) -> bool:
        if workflow_id in self.workflows:
            del self.workflows[workflow_id]
            return True
        return False