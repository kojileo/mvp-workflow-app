from app.models.workflow import Workflow, Step
import asyncio

class WorkflowExecutor:
    @staticmethod
    async def execute_workflow(workflow: Workflow):
        for step in workflow.steps:
            await WorkflowExecutor.execute_step(step)

    @staticmethod
    async def execute_step(step: Step):
        print(f"ステップを実行中: {step.name}")
        step.status = '実行中'
        
        # ステップ実行をシミュレート
        if step.processing_time == '短':
            await asyncio.sleep(1)
        elif step.processing_time == '中':
            await asyncio.sleep(3)
        else:
            await asyncio.sleep(5)

        # TODO: ここに実際のコマンド実行ロジックを実装する
        
        step.status = '完了'
        print(f"ステップ完了: {step.name}")