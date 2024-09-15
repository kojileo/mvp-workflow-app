import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TitlePage from "./components/TitlePage";
import AboutPage from "./components/AboutPage";
import WorkflowEditor from "./components/WorkflowEditor";
import styled from "styled-components";

const NavBar = styled.nav`
  background-color: #333;
  padding: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.main``;

const NotFound = () => (
  <div>
    <h1>404: Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <NavBar>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/app">Workflow Editor</NavLink>
      </NavBar>
      <MainContent>
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/app" element={<WorkflowEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </Router>
  );
};

export default App;
