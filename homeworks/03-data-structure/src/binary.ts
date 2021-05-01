import {Errors} from "./utils/errors";

export enum TraverseType {
    Bfs = "Bfs",
    DfsInorder = "DfsInorder",
    DfsPreorder = "DfsPreorder",
    DfsPostOrder = "DfsPostOrder"
}

export interface ITreeNode<T = number> {
    value: T;
    left?: ITreeNode<T>;
    right?: ITreeNode<T>;
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

    public getColumn(columnOrder: number): T[] {
        const traverseWithColumnNumber = (
            node: ITreeNode<T>,
            column: number,
            callback: (node: ITreeNode<T>, column: number) => void
        ) => {
            callback(node, column);

            if (node.left)  { traverseWithColumnNumber(node.left,  column - 1, callback) }
            if (node.right) { traverseWithColumnNumber(node.right, column + 1, callback) }
        }

        const result: T[] = [];
        traverseWithColumnNumber(this.tree, 0, (node, column) => {
            if (column === columnOrder) result.push(node.value);
        })
        return result;
    }

    public traverse(traverseType: TraverseType, callback?: (tree?: ITreeNode<T>) => void): T[] {
        function assertNever(arg: never): never {
            throw new Error(`${Errors.UnexpectedArg}: ${arg}`);
        }

        if (traverseType === TraverseType.Bfs) {
            const result: T[] = [];
            const queue: ITreeNode<T>[] = [this.tree];

            while (queue.length > 0) {
                // get one element from queue head
                const node = queue.shift();
                    result.push(node!.value);
                    if (callback) callback(node);
                    if (node && node.left  !== undefined) queue.push(node.left);
                    if (node && node.right !== undefined) queue.push(node.right);
            }
            return result;
        } else {
            const {left: leftNode, right: rightNode}  = this.tree;
            const leftArr  = leftNode  === undefined ? [] : new BinaryTree(leftNode).traverse(traverseType, callback);
            const rightArr = rightNode === undefined ? [] : new BinaryTree(rightNode).traverse(traverseType, callback);
            if (callback) callback(this.tree);
            switch (traverseType) {
                case TraverseType.DfsPreorder:
                    return [
                        this.tree.value,
                        ...leftArr,
                        ...rightArr,
                    ]
                case TraverseType.DfsInorder: {
                    return [
                        ...leftArr,
                        this.tree.value,
                        ...rightArr
                    ]
                }
                case TraverseType.DfsPostOrder: {
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
    public has(value: number): boolean {
        let has = false;
        this.traverse(TraverseType.Bfs, item => {
            if (item && item.value === value) has = true;
        })
        return has;
    }
}
