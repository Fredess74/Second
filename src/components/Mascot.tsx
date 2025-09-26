import Svg, { Circle, Path } from 'react-native-svg';
import { View, Text } from 'react-native';

interface MascotProps {
  status: 'happy' | 'excited' | 'sleepy';
}

const Mascot: React.FC<MascotProps> = ({ status }) => {
  const faceColor = status === 'excited' ? '#FF8F3F' : status === 'sleepy' ? '#A0AEC0' : '#7F5AF0';
  const smile = status === 'sleepy' ? 'M35 55 Q50 45 65 55' : 'M35 55 Q50 70 65 55';

  return (
    <View className="items-center">
      <Svg height={120} width={120} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" fill={faceColor} opacity={0.95} />
        <Circle cx="35" cy="40" r="6" fill="#fff" />
        <Circle cx="65" cy="40" r="6" fill="#fff" />
        <Path d="M32 38 Q35 34 38 38" stroke="#333" strokeWidth={2} strokeLinecap="round" />
        <Path d="M62 38 Q65 34 68 38" stroke="#333" strokeWidth={2} strokeLinecap="round" />
        <Path d={smile} stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" />
      </Svg>
      <Text className="text-sm text-gray-600 mt-2 capitalize">Mascot is {status}</Text>
    </View>
  );
};

export default Mascot;
