import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label="Toggle color mode">
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        onClick={toggleColorMode}
        size="md"
        position="absolute"
        top="1.5rem"
        right="1.5rem"
        variant="ghost"
        _hover={{ transform: 'scale(1.2)', transition: '0.2s ease-in-out' }}
      />
    </Tooltip>
  );
};

export default ColorModeToggle;
