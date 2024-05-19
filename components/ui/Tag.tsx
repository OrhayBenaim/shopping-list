import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/utils/theme';

interface TagProps {
  label: string;
  onPress: (state: boolean) => void;
}
const Tag = ({ label, onPress }: TagProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const theme = useTheme();

  const onToggle = () => {
    setSelected((s) => !s);
    onPress(!selected);
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      aria-selected={selected}
      style={[selected ? theme.tag.selected.button : theme.tag.normal.button]}
    >
      <Text
        style={[selected ? theme.tag.selected.text : theme.tag.normal.text]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Tag;
