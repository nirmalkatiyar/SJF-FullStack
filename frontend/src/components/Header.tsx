import { HeaderProps } from "../types/types";
import { Button, Container, Title } from "../skins";

const Header = (props : HeaderProps) => {
  const { onClick, title } = props;
  return (
    <Container>
      <Title>{title}</Title>
      {onClick && <Button onClick={onClick}>Submit New Job</Button>}
    </Container>
  );
};

export default Header;
