export enum Errors {
    UNEXPECTED_ARG = "Unexpected argument"
}

export enum TraverseType {
    BFS = "BFS",
    DFS_INORDER = "DFS_INORDER",
    DFS_PREORDER = "DFS_PREORDER",
    DFS_POSTORDER = "DFS_POSTORDER"
}

export interface ITreeNode<T = number> {
    value: T;
    left?: ITreeNode<T>;
    right?: ITreeNode<T>;
    column?: number;
}

export interface IBinaryTree<T = number> {
    setTree(tree: ITreeNode<T>): this;
    traverse(traverseType: TraverseType): T[];
    getColumn(columnOrder: number): T[];
}

export class BinaryTree<T = number> implements IBinaryTree<T> {
    private tree: ITreeNode<T>;
    public constructor(tree: ITreeNode<T>) {
        this.tree = tree;
    }

    public setTree(tree: ITreeNode<T>): this {
        this.tree = tree;
        return this;
    }

    protected fillColumns(initialColumn: number): this {
        this.tree.column = initialColumn;
        if (this.tree.left) new BinaryTree(this.tree.left).fillColumns(initialColumn - 1);
        if (this.tree.right) new BinaryTree(this.tree.right).fillColumns(initialColumn + 1);
        return this;
    }

    public getColumn(columnOrder: number): T[] {
        // fill columns
        this.fillColumns(0);
        const result: T[] = [];
        this.traverse(TraverseType.DFS_INORDER, node => {
            if (node!.column === columnOrder) result.push(node!.value);
        })
        return result;
    }

    public traverse(traverseType: TraverseType, callback?: (tree?: ITreeNode<T>) => void): T[] {
        function assertNever(arg: never): never {
            throw new Error(`${Errors.UNEXPECTED_ARG}: ${arg}`);
        }

        if (traverseType === TraverseType.BFS) {
            const result: T[] = [];
            const queue: ITreeNode<T>[] = [this.tree];

            while (queue.length > 0) {
                // get one element from queue head
                const node = queue.shift();
                    result.push(node!.value);
                    if (callback) callback(node);
                    if (node!.left  !== undefined) queue.push(node!.left);
                    if (node!.right !== undefined) queue.push(node!.right);
            }
            return result;
        } else {
            const leftNode  = this.tree.left;
            const rightNode = this.tree.right;
            const leftArr  = leftNode  === undefined ? [] : new BinaryTree(leftNode).traverse(traverseType, callback);
            const rightArr = rightNode === undefined ? [] : new BinaryTree(rightNode).traverse(traverseType, callback);
            if (callback) callback(this.tree);
            switch (traverseType) {
                case TraverseType.DFS_PREORDER:
                    return [
                        this.tree.value,
                        ...leftArr,
                        ...rightArr,
                    ]
                case TraverseType.DFS_INORDER: {
                    return [
                        ...leftArr,
                        this.tree.value,
                        ...rightArr
                    ]
                }
                case TraverseType.DFS_POSTORDER: {
                    return [
                        ...leftArr,
                        ...rightArr,
                        this.tree.value,
                    ]
                }
                default:
                    return assertNever(traverseType);
            }
        }
    }
}

export interface IBinarySearchTree extends IBinaryTree<number> {
    has(value: number): boolean;
}

export class BinarySearchTree extends BinaryTree<number> implements IBinarySearchTree {
    has(value: number): boolean {
        let has = false;
        this.traverse(TraverseType.BFS, item => {
            if (item!.value === value) has = true;
        })
        return has;
    }
}
