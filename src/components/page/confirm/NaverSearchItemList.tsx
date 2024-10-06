import React from 'react'
import NaverSearchItemComponent from './NaverSearchItemComponent'
import { INaverSearchItem } from '@/interfaces/search/INaverSearch'

interface Props {
    items: INaverSearchItem[]
    selectedItems: Set<number> // 선택된 항목을 상위에서 제어
    onSelectionChange: (index: number) => void // 선택 변경 시 호출
    isAllSelected: boolean // 전체 선택 상태
    onToggleSelectAll: () => void // 전체 선택/해제 토글
}

const NaverSearchItemList: React.FC<Props> = ({
    items,
    selectedItems,
    onSelectionChange,
    isAllSelected,
    onToggleSelectAll,
}) => {
    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <NaverSearchItemComponent
                        key={index}
                        index={index}
                        item={item}
                        isSelected={selectedItems.has(index)}
                        onToggleSelect={(index) => onSelectionChange(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default NaverSearchItemList
