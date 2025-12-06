import RightInventoryGrid from './RightInventoryGrid';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  return <RightInventoryGrid inventory={rightInventory} />;
};

export default RightInventory;
