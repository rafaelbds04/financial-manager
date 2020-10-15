import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

import DropDownPicker from 'react-native-dropdown-picker';

interface CategorySelectorProps {
    sectionName: string,
    defaultValue?: any,
    items: any,
    onChangeItem: (item: any, index: number) => void;
}

export interface CategorySelectorItem {
    label: string,
    value: string | number;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ sectionName, items, defaultValue, onChangeItem }) => {
    return (
        <View style={styles.inputContainer} >
            <Text style={styles.inputTitle} >{sectionName}</Text>
            <DropDownPicker
                items={items}
                defaultValue={defaultValue}
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{ backgroundColor: '#fafafa', flex: 1 }}
                onChangeItem={onChangeItem}
            />

        </View>
    );
}

export default CategorySelector;