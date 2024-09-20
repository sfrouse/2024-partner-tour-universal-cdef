


export default function findSlotChildren(node: any, slotChildren: any[] = []) {
    if (node.children) {
        node.children.map((child: any) => {
            if (
                child.type === 'INSTANCE' &&
                // child.mainComponent?.name === '_slot'
                child.mainComponent?.parent?.name === '_slot'
            ) {
                slotChildren.push(child);

            }else{
                // not entirely recursive...
                // the slot will be process on it's own
                findSlotChildren(child, slotChildren);
            }
        })
    }
    return slotChildren;
}