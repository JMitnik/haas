import { defaultPostLeafNode } from './TreeNodeModel';
import TreeModel from './TreeModel';

test('creates a barebones TreeModel', () => {
  const tree = TreeModel.create({
    activeLeaf: defaultPostLeafNode.id,
    publicTitle: 'Starbucks dialogue',
    title: 'StarbucksDialogue',
  });

  expect(tree.title).toBe('StarbucksDialogue');
});
