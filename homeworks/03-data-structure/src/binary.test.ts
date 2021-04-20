import {BinarySearchTree, BinaryTree, Errors, IBinarySearchTree, IBinaryTree, ITreeNode, TraverseType} from "./binary";

describe("All tests", () => {
    describe("BinaryTree", () => {
        /*
        *             node1
        *            /     \
        *       node2      node3
        *        / \           \
        *   node4  node5       node6
        *           / \          /
        *      node7  node8   node9
        * */
        const nodeNum: ITreeNode<number> = {
            value: 1,
            left: {
                value: 2,
                left: { value: 4 },
                right: {
                    value: 5,
                    left:  { value: 7 },
                    right: { value: 8 }
                }
            },
            right: {
                value: 3,
                right: {
                    value: 6,
                    left: { value: 9 }
                }
            }
        }
        const treeNum: IBinaryTree<number> = new BinaryTree(nodeNum);
        const nodeStr: ITreeNode<string> = {
            value: "1",
            left: {
                value: "2",
                left: { value: "4" },
                right: {
                    value: "5",
                    left:  { value: "77" },
                    right: { value: "08" }
                }
            },
            right: {
                value: "3",
                right: {
                    value: "6",
                    left: { value: "9" }
                }
            }
        }
        const treeStr: IBinaryTree<string> = new BinaryTree(nodeStr);

        it("BinaryTree: with one element", () => {
            let node1: ITreeNode<number> = { value: 42 };
            let tree1: IBinaryTree<number> = new BinaryTree<number>(node1);
            expect(tree1.traverse(TraverseType.BFS)).toEqual([42]);
            expect(tree1.traverse(TraverseType.DFS_POSTORDER)).toEqual([42]);
            expect(tree1.traverse(TraverseType.DFS_PREORDER)).toEqual([42]);
            expect(tree1.traverse(TraverseType.DFS_INORDER)).toEqual([42]);

            let node2: ITreeNode<string> = { value: "forty two" };
            let tree2: IBinaryTree<string> = new BinaryTree<string>(node2);
            expect(tree2.traverse(TraverseType.BFS)).toEqual(["forty two"]);
            expect(tree2.traverse(TraverseType.DFS_POSTORDER)).toEqual(["forty two"]);
            expect(tree2.traverse(TraverseType.DFS_PREORDER)).toEqual(["forty two"]);
            expect(tree2.traverse(TraverseType.DFS_INORDER)).toEqual(["forty two"]);
        });

        it("BinaryTree<number> traverse", () => {
            expect(treeNum.traverse(TraverseType.DFS_PREORDER)).toEqual([1, 2, 4, 5, 7, 8, 3, 6, 9]);
            expect(treeNum.traverse(TraverseType.DFS_INORDER)).toEqual([4, 2, 7, 5, 8, 1, 3, 9, 6]);
            expect(treeNum.traverse(TraverseType.DFS_POSTORDER)).toEqual([4, 7, 8, 5, 2, 9, 6, 3, 1]);
            expect(treeNum.traverse(TraverseType.BFS)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it("BinaryTree<string> traverse", () => {
            expect(treeStr.traverse(TraverseType.DFS_PREORDER)).toEqual(["1", "2", "4", "5", "77", "08", "3", "6", "9"]);
            expect(treeStr.traverse(TraverseType.DFS_INORDER)).toEqual(["4", "2", "77", "5", "08", "1", "3", "9", "6"]);
            expect(treeStr.traverse(TraverseType.DFS_POSTORDER)).toEqual(["4", "77", "08", "5", "2", "9", "6", "3", "1"]);
            expect(treeStr.traverse(TraverseType.BFS)).toEqual(["1", "2", "3", "4", "5", "6", "77", "08", "9"]);
        });

        it("BinaryTree: unknown traverse type", () => {
            expect(() => treeStr.traverse("__UNKNOWN__" as TraverseType)).toThrow();
        });

        it("BinaryTree.getColumn()", () => {
            expect(treeNum.getColumn(0).sort()).toEqual([1, 5].sort());
            expect(treeNum.getColumn(1).sort()).toEqual([3, 8, 9].sort());
            expect(treeNum.getColumn(2).sort()).toEqual([6].sort());
            expect(treeNum.getColumn(-1).sort()).toEqual([2, 7].sort());
            expect(treeNum.getColumn(-2).sort()).toEqual([4].sort());
        });

        it("BinaryTree.setTree()", () => {
            const node: ITreeNode<number> = { value: 42 };
            const tree: IBinaryTree<number> = new BinaryTree(node);
            expect(tree.setTree(
                { value: 142, left: { value: 143 }, right: { value: 144 } }
            ).traverse(TraverseType.BFS)).toEqual([142, 143, 144]);
        });
    });

    describe("BinarySearchTree", () => {
        /*
        *             node1
        *            /     \
        *       node2      node3
        *        / \           \
        *   node4  node5       node6
        *           / \          /
        *      node7  node8   node9
        * */
        const nodeNum: ITreeNode<number> = {
            value: 1,
            left: {
                value: 2,
                left: { value: 4 },
                right: {
                    value: 5,
                    left:  { value: 7 },
                    right: { value: 8 }
                }
            },
            right: {
                value: 3,
                right: {
                    value: 6,
                    left: { value: 9 }
                }
            }
        }
        const searchTree: IBinarySearchTree = new BinarySearchTree(nodeNum);
        it("BinarySearchTree.has()", () => {
            expect(searchTree.has(1)).toEqual(true);
            expect(searchTree.has(42)).toEqual(false);
            expect(searchTree.has(9)).toEqual(true);
            expect(searchTree.has(10)).toEqual(false);
            expect(searchTree.has(0)).toEqual(false);
            expect(searchTree.has(-1)).toEqual(false);
        })
    });
})
