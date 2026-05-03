import type { ImageSourcePropType } from 'react-native';
import { Image, Modal, Pressable, Text, View } from 'react-native';

import { categories, categoryIcons, uncategorizedIcon } from '../expense-data';
import { styles } from '../expense-styles';
import type { Category } from '../types';

type CategoryPickerModalProps = {
  selectedCategory: Category | null;
  onClose: () => void;
  onSelectCategory: (category: Category | null) => void;
  visible: boolean;
};

export function CategoryPickerModal({
  selectedCategory,
  onClose,
  onSelectCategory,
  visible,
}: CategoryPickerModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalPanel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select category</Text>
          <Text style={styles.modalSubtitle}>New expenses stay uncategorized by default.</Text>

          <View style={styles.categoryGrid}>
            <CategoryOption
              icon={uncategorizedIcon}
              label="No category"
              selected={selectedCategory === null}
              onPress={() => onSelectCategory(null)}
            />
            {categories.map((category) => (
              <CategoryOption
                key={category}
                icon={categoryIcons[category]}
                label={category}
                selected={selectedCategory === category}
                onPress={() => onSelectCategory(category)}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type CategoryOptionProps = {
  icon: ImageSourcePropType;
  label: string;
  selected: boolean;
  onPress: () => void;
};

function CategoryOption({ icon, label, selected, onPress }: CategoryOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryOption,
        selected && styles.categoryOptionSelected,
        pressed && styles.pressed,
      ]}>
      <Image source={icon} style={styles.categoryOptionIcon} />
      <Text style={[styles.categoryOptionText, selected && styles.categoryOptionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}
