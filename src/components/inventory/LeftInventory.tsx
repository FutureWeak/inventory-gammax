import LeftInventoryGrid from './LeftInventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return <LeftInventoryGrid inventory={leftInventory} />;
};

export default LeftInventory;
