import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background-color: #f0f4f8;
  color: #333;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const Content = styled.div`
  max-width: 800px;
  text-align: justify;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  text-decoration: none;
  color: white;
  background-color: #3498db;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <Title>AIクリエイトスタジオについて</Title>
      <Content>
        <Section>
          <SectionTitle>概要</SectionTitle>
          <p>
            AIクリエイトスタジオは、AIを活用した革新的なワークフロー作成ツールです。
            複雑なタスクを視覚的に設計し、自動化することができます。
          </p>
        </Section>
        <Section>
          <SectionTitle>主な機能</SectionTitle>
          <ul>
            <li>直感的なドラッグ＆ドロップインターフェース</li>
            <li>多様なAI機能を統合したノード</li>
            <li>カスタマイズ可能なワークフロー</li>
            <li>リアルタイムプレビューと実行</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>使い方</SectionTitle>
          <p>
            1. ノードをキャンバスにドラッグ＆ドロップ 2.
            ノード間を接続してワークフローを作成 3. 各ノードのパラメータを設定
            4. ワークフローを実行し、結果を確認
          </p>
        </Section>
      </Content>
      <BackButton to="/">トップページに戻る</BackButton>
    </PageContainer>
  );
};

export default AboutPage;
