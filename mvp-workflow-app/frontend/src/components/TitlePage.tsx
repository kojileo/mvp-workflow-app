import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: white;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  text-decoration: none;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: #e73c7e;
  }
`;

const TitlePage: React.FC = () => {
  return (
    <PageContainer>
      <Title>AIクリエイトスタジオ</Title>
      <Subtitle>
        AIパワードワークフローで、あなたのクリエイティブプロセスを革新しましょう。
        直感的なインターフェースで、複雑なタスクを簡単に自動化できます。
      </Subtitle>
      <ButtonContainer>
        <StyledButton to="/app">アプリを起動</StyledButton>
        <StyledButton to="/about">アプリについて</StyledButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default TitlePage;
