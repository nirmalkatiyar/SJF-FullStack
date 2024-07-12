import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Poppins:300,500');
  :root {
    --primary: #11998e;
    --secondary: #38ef7d;
    --white: #fff;
    --gray: #9b9b9b;
  }
`;

export const LeftContainer = styled.div<{ isLeft?: boolean }>`
  ${({ isLeft }) => (isLeft ? `width: 60%;` : `width: 40%;`)}
  padding: 0 1rem;
  overflow: auto;
`;

export const ScrollDiv = styled.div<{ isLeft?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isLeft }) => isLeft && `background-color: rgb(247 247 247);`}
  padding: 1rem;
  border-radius: 2%;
  height: calc(100vh - 11.25rem);
  overflow: auto;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

export const Button = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #555;
  }
`;

export const FormGroup = styled.div`
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;
`;

export const FormField = styled.input`
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid var(--gray);
  outline: 0;
  font-size: 1.3rem;
  color: var(--white);
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ .form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }

  &:focus {
    & ~ .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: var(--primary);
      font-weight: 700;
    }
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, var(--primary), var(--secondary));
    border-image-slice: 1;
  }

  &:required,
  &:invalid {
    box-shadow: none;
  }
`;

export const FormLabel = styled.label`
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: var(--gray);
`;

export const JobDetailsContainer = styled.div<{ isRight?: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: white;
  ${({ isRight }) => isRight && `background-color: rgb(247 247 247);`}
  padding: 20px;
  margin: 10px 0;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const JobInfo = styled.div`
  display: flex;
  padding-bottom: 10px;
  justify-content: space-between;
  width: 100%;
`;

export const BoldDiv = styled.div`
  font-weight: bold;
`;


export const ProgressContainer = styled.div`
  width: 100%;
  text-align: left;
`;

export const FormPopupBg = styled.div`
  color: #fff;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  position: absolute;
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormContainer = styled.div`
  background-color: var(--color-card-background);
  border-radius: var(--default-border-radius);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
  margin: auto;
  position: relative;
  padding: 40px;
  color: #fff;
  width: 50%;
  height: 50%;
  background-color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  color: #fff;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  border: solid 1px #fff;
`;

export const ButtonPopUp = styled.button`
  all: unset;
  background-color: var(--primary);
  right: 50px;
  bottom: 50px;
  position: absolute;
  padding: 15px;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    border: 1px solid white;
    box-sizing: border-box;
  }
`;

export const Switch = styled.div`
  position: relative;
  width: 60px;
  height: 28px;
  background: #b3b3b3;
  border-radius: 32px;
  padding: 4px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: white;
    transform: translate(0, -50%);
  }
`;

export const Input = styled.input`
  display: none;

  &:checked + ${Switch} {
    background: green;

    &:before {
      transform: translate(32px, -50%);
    }
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;


export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  padding: 10px 20px;
  color: white;
  height: 3rem;
`;

export const Logo = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

export const NavButtons = styled.div`
  button {
    color: white;
    background: none;
    border: none;
    margin-left: 20px;
    font-size: 1em;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const QuanDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: larger;
  gap: 1rem;
`;

export const HeadingDiv = styled.div`
  font-size: larger;
  text-align: left;
`;