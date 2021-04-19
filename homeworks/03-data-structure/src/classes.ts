enum TraverseType {
    BFS = "BFS",
    DFS_INORDER = "DFS_INORDER",
    DFS_PREORDER = "DFS_PREORDER",
    DFS_POSTORDER = "DFS_POSTORDER"
}

interface TreeNode<T> {
    value: T;
    left: TreeNode<T>;
    right: TreeNode<T>;
}

interface BinaryTree<T> {
    constructor(tree: TreeNode<T>): void;
    setTree(tree: TreeNode<T>): this;

    // Depth-First Search (DFS) - inorder, preorder, postorder
    // Breadth-First Search (BFS) - breadth
    traverse(traverseType: TraverseType): T[];
    getColumn(columnOrder: number): T[];
}

class BinaryTree<T> {
    constructor(tree: TreeNode<T>) {

    }
}
