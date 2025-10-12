import {
    getDialogWidth,
    isSmallScreen,
    moderateScale,
    scale,
    scaleBorderRadius,
    scaleButton,
    scaleFont,
    scaleIcon,
    verticalScale,
} from '@/constants/responsive';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types
interface NameItem {
  id: string;
  name: string;
  image?: string;
  isFavorite: boolean;
  createdAt: Date;
}

// Responsive styles using utility functions
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: scale(20),
    bottom: verticalScale(30),
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  listContainer: {
    padding: scale(16),
    paddingBottom: verticalScale(80),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(40),
  },
  emptyText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginTop: verticalScale(12),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: getDialogWidth(),
    borderRadius: scaleBorderRadius(16),
    padding: scale(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dialogTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: scaleBorderRadius(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontSize: scaleFont(14),
    marginBottom: verticalScale(16),
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: scale(8),
  },
  dialogButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: scaleBorderRadius(8),
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  okButton: {
    // backgroundColor already set in style
  },
  yesButton: {
    // backgroundColor already set in style
  },
  skipButton: {
    borderWidth: 1,
  },
  dialogButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '500',
  },
  nameItem: {
    borderWidth: 1,
    borderRadius: scaleBorderRadius(10),
    marginBottom: verticalScale(8),
    overflow: 'hidden',
  },
  nameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
  },
  itemImage: {
    width: scaleIcon(40),
    height: scaleIcon(40),
    borderRadius: scaleBorderRadius(20),
    marginRight: scale(10),
  },
  nameTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: scaleFont(16),
    flex: 1,
  },
  favoriteIcon: {
    marginLeft: scale(8),
  },
  itemActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    borderTopWidth: 1,
    padding: scale(6),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(6),
  },
  menuText: {
    fontSize: scaleFont(14),
    marginLeft: scale(8),
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  editOptionText: {
    fontSize: scaleFont(16),
    marginLeft: scale(12),
  },
  closeEditButton: {
    marginTop: verticalScale(12),
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  closeEditText: {
    fontSize: scaleFont(14),
  },
  copyDialog: {
    width: getDialogWidth(),
    borderRadius: scaleBorderRadius(16),
    padding: scale(20),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  copyDialogTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
  },
  copyDialogText: {
    fontSize: scaleFont(14),
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  copyDialogButton: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(10),
    borderRadius: scaleBorderRadius(8),
    minWidth: scaleButton(60),
  },
  copyDialogButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '500',
  },
});


// Name Input Dialog Component
function NameInputDialog({
  visible,
  onClose,
  onSubmit,
  styles,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  styles: any;
}) {
  const [name, setName] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSubmit = useCallback(() => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
      onClose();
    }
  }, [name, onSubmit, onClose]);

  const handleCancel = useCallback(() => {
    setName('');
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dialogTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
            Enter her name
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'Inter-Medium',
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Type a name..."
            placeholderTextColor={colors.icon}
            autoFocus
          />
          <View style={styles.dialogButtons}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.dialogButtonText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogButton, styles.okButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.dialogButtonText, { color: colors.background, fontFamily: 'Inter-SemiBold' }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Image Selection Dialog Component
function ImageSelectionDialog({
  visible,
  onClose,
  onSelectImage,
  onSkip,
  styles,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectImage: () => void;
  onSkip: () => void;
  styles: any;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dialogTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
            Add her image
          </Text>
          <View style={styles.dialogButtons}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.yesButton, { backgroundColor: colors.primary }]}
              onPress={onSelectImage}
            >
              <Text style={[styles.dialogButtonText, { color: colors.background, fontFamily: 'Inter-SemiBold' }]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogButton, styles.skipButton, { borderColor: colors.border }]}
              onPress={onSkip}
            >
              <Text style={[styles.dialogButtonText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Name Item Component
function NameItemComponent({
  item,
  onCopy,
  onToggleFavorite,
  onEdit,
  onDelete,
  onEditName,
  onEditImage,
}: {
  item: NameItem;
  onCopy: (name: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onEditName: (id: string) => void;
  onEditImage: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleMenuPress = useCallback(() => {
    console.log('Menu pressed, current showMenu:', showMenu);
    setShowMenu(!showMenu);
    console.log('Menu should now be:', !showMenu);
  }, [showMenu]);

  const handleEdit = useCallback(() => {
    console.log('Edit option selected for item:', item.id);
    setShowMenu(false);
    console.log('Menu closed, calling onEdit');
    onEdit(item.id);
  }, [item.id, onEdit]);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    console.log('Delete clicked for item:', item.id, item.name);
    // حذف مستقیم بدون تایید - چون قبلاً تایید شده
    console.log('Deleting item:', item.id);
    onDelete(item.id);
    console.log('Item deleted successfully');
  }, [item.id, onDelete]);

  return (
    <View style={[styles.nameItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.nameContent}
        onLongPress={Platform.OS !== 'web' ? () => {/* Drag functionality will be handled by DraggableFlatList */} : undefined}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        )}
        <View style={styles.nameTextContainer}>
          <Text style={[styles.nameText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
            {item.name}
          </Text>
          {item.isFavorite && (
            <Ionicons name="star" size={16} color={colors.primary} style={styles.favoriteIcon} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => onCopy(item.name)}
        >
          <Ionicons name="copy" size={16} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={handleMenuPress}
        >
          <Ionicons name="ellipsis-vertical" size={16} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              onToggleFavorite(item.id);
            }}
          >
            <Ionicons
              name={item.isFavorite ? "star-outline" : "star"}
              size={16}
              color={colors.text}
            />
            <Text style={[styles.menuText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
              {item.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
            <Ionicons name="create" size={16} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error, fontFamily: 'Inter-Medium' }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Edit Name Dialog Component
function EditNameDialog({
  visible,
  name,
  onClose,
  onSave,
  styles,
}: {
  visible: boolean;
  name: string;
  onClose: () => void;
  onSave: (newName: string) => void;
  styles: any;
}) {
  const [editName, setEditName] = useState(name);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  console.log('EditNameDialog rendered with:', { visible, name, editName });

  const handleSave = useCallback(() => {
    console.log('EditNameDialog Save clicked');
    console.log('Current editName:', editName);
    const trimmedName = editName ? editName.trim() : '';
    console.log('Trimmed name:', trimmedName);

    if (trimmedName) {
      console.log('Calling onSave with:', trimmedName);
      // قبل از فراخوانی onSave، مطمئن شو که مقدار درست است
      console.log('About to call onSave with:', trimmedName);
      onSave(trimmedName);
      console.log('onSave called with:', trimmedName);
    } else {
      console.log('Cannot save - editName is empty');
      Alert.alert('Error', 'Please enter a name');
    }
  }, [editName, onSave]);

  // Debug: log whenever editName changes
  useEffect(() => {
    console.log('EditNameDialog - editName changed to:', editName);
  }, [editName]);

  useEffect(() => {
    console.log('EditNameDialog - name prop changed to:', name);
    console.log('Current editName:', editName);
    if (name) {
      console.log('Setting editName to:', name);
      setEditName(name);
      console.log('editName set to:', name);
    }
  }, [name]);

  // Debug: log whenever editName changes
  useEffect(() => {
    console.log('EditNameDialog - editName changed to:', editName);
  }, [editName]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dialogTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
            Edit Name
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.border,
                fontFamily: 'Inter-Medium',
              },
            ]}
            value={editName}
            onChangeText={(text) => {
              console.log('TextInput onChangeText called with:', text);
              setEditName(text);
              console.log('editName set to:', text);
            }}
            onChange={(e: any) => {
              // Fallback for web compatibility
              const text = e.nativeEvent?.text || (e.target as any)?.value || '';
              console.log('TextInput onChange fallback called with:', text);
              if (text !== editName) {
                setEditName(text);
                console.log('editName set to (fallback):', text);
              }
            }}
            placeholder="Enter new name..."
            placeholderTextColor={colors.icon}
            autoFocus
          />
          <View style={styles.dialogButtons}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.dialogButtonText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogButton, styles.okButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.dialogButtonText, { color: colors.background, fontFamily: 'Inter-SemiBold' }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Copy Dialog Component
function CopyDialog({
  visible,
  name,
  onClose,
  styles,
}: {
  visible: boolean;
  name: string;
  onClose: () => void;
  styles: any;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.copyDialog, { backgroundColor: colors.surface }]}>
          <Ionicons name="checkmark-circle" size={scaleIcon(isSmallScreen ? 36 : 48)} color={colors.primary} />
          <Text style={[styles.copyDialogTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
            Copied!
          </Text>
          <Text style={[styles.copyDialogText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
            {name} has been copied to clipboard
          </Text>
          <TouchableOpacity style={[styles.copyDialogButton, { backgroundColor: colors.primary }]} onPress={onClose}>
            <Text style={[styles.copyDialogButtonText, { color: colors.background, fontFamily: 'Inter-SemiBold' }]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Edit Dialog Component
function EditDialog({
  visible,
  item,
  onClose,
  onEditName,
  onEditImage,
  styles,
}: {
  visible: boolean;
  item?: NameItem;
  onClose: () => void;
  onEditName: () => void;
  onEditImage: () => void;
  styles: any;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!visible || !item) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.dialogTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
            Edit {item.name}
          </Text>
          <TouchableOpacity style={styles.editOption} onPress={onEditName}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <Text style={[styles.editOptionText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
              Edit name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editOption} onPress={onEditImage}>
            <Ionicons name="image" size={20} color={colors.primary} />
            <Text style={[styles.editOptionText, { color: colors.text, fontFamily: 'Inter-Medium' }]}>
              Edit image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeEditButton} onPress={onClose}>
            <Text style={[styles.closeEditText, { color: colors.primary, fontFamily: 'Inter-Medium' }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Main Home Screen Component
export default function HomeScreen() {
  const [names, setNames] = useState<NameItem[]>([]);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copiedName, setCopiedName] = useState('');
  const [editingItem, setEditingItem] = useState<NameItem | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [editingName, setEditingName] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Dynamic icon sizing based on screen size - smaller for mobile
  const iconSize = moderateScale(16);

  // Use safe area insets for proper top spacing
  const topPadding = Math.max(insets.top, 20); // Minimum 20px for safety

  // Sort names to show favorites first
  const sortedNames = [...names].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAddName = useCallback((name: string) => {
    setCurrentName(name);
    setShowImageDialog(true);
  }, []);

  const handleImageSelection = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newItem: NameItem = {
        id: Date.now().toString(),
        name: currentName,
        image: result.assets[0].uri,
        isFavorite: false,
        createdAt: new Date(),
      };
      setNames(prev => [newItem, ...prev]);
      setCurrentName('');
      setShowImageDialog(false);
    }
  }, [currentName]);

  const handleSkipImage = useCallback(() => {
    const newItem: NameItem = {
      id: Date.now().toString(),
      name: currentName,
      isFavorite: false,
      createdAt: new Date(),
    };
    setNames(prev => [newItem, ...prev]);
    setCurrentName('');
    setShowImageDialog(false);
  }, [currentName]);

  const handleCopy = useCallback(async (name: string) => {
    await Clipboard.setStringAsync(name);
    setCopiedName(name);
    setShowCopyDialog(true);
    // Auto close after 2 seconds
    setTimeout(() => {
      setShowCopyDialog(false);
      setCopiedName('');
    }, 2000);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setNames(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log('handleEdit called with id:', id);
    const item = names.find(n => n.id === id);
    if (item) {
      console.log('Found item for editing:', item.id, item.name);
      setEditingItem(item);
      setShowEditDialog(true);
      console.log('Edit dialog should now be visible');
    } else {
      console.log('Item not found for id:', id);
    }
  }, [names]);

  const handleDelete = useCallback((id: string) => {
    setNames(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleEditName = useCallback(() => {
    if (editingItem) {
      console.log('Edit name clicked for item:', editingItem.id, 'with name:', editingItem.name);
      const currentName = editingItem.name;
      console.log('Setting editingName to:', currentName);
      setEditingName(currentName);
      console.log('editingName set to:', currentName);
      setShowEditDialog(false);
      setShowEditNameDialog(true);
      console.log('Dialog should now be visible');
    } else {
      console.log('No editing item found for edit name');
    }
  }, [editingItem]);

  const handleSaveEditName = useCallback((newName?: string) => {
    console.log('handleSaveEditName called with:', newName);
    console.log('Current editingName:', editingName);
    console.log('Current names before update:', names);

    const nameToSave = newName || editingName;

    if (editingItem && nameToSave && nameToSave.trim()) {
      const trimmedName = nameToSave.trim();
      console.log('Saving edit name:', trimmedName, 'for item:', editingItem.id);

      // مستقیم setNames را فراخوانی کن
      setNames(prev => {
        console.log('Previous names length:', prev.length);
        const updatedNames = prev.map(item => {
          console.log('Checking item:', item.id, item.name, 'target id:', editingItem.id);
          if (item.id === editingItem.id) {
            console.log('Found item to update:', item.id, 'from', item.name, 'to', trimmedName);
            return { ...item, name: trimmedName };
          }
          return item;
        });
        console.log('Updated names length:', updatedNames.length);
        const updatedItem = updatedNames.find(item => item.id === editingItem.id);
        console.log('Updated item:', updatedItem);
        return updatedNames;
      });

      setShowEditNameDialog(false);
      setEditingItem(null);
      setEditingName('');
      console.log('Name saved successfully');

      // Force re-render to show updated names
      forceUpdate();
    } else {
      console.log('Cannot save - missing data:', {
        editingItem: editingItem ? editingItem.id : 'null',
        editingName: editingName,
        newName: newName,
        trimmed: nameToSave?.trim(),
        hasEditingItem: !!editingItem,
        hasName: !!nameToSave,
        hasTrimmedName: !!nameToSave?.trim()
      });
      Alert.alert('Error', 'Please enter a valid name');
    }
  }, [editingItem, editingName, names, setNames]);

  // Force re-render after save
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleEditImage = useCallback(async () => {
    if (editingItem) {
      console.log('Starting image edit for item:', editingItem.id);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log('Updating image for item:', editingItem.id, 'with URI:', result.assets[0].uri);
        setNames(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? { ...item, image: result.assets[0].uri }
              : item
          )
        );
      } else {
        console.log('Image selection cancelled');
      }
      setShowEditDialog(false);
      setEditingItem(null);
    } else {
      console.log('No editing item found for image edit');
    }
  }, [editingItem]);

  const renderItem = useCallback(({ item }: { item: NameItem; index?: number; drag?: () => void }) => (
    <NameItemComponent
      item={item}
      onCopy={handleCopy}
      onToggleFavorite={handleToggleFavorite}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onEditName={handleEditName}
      onEditImage={handleEditImage}
    />
  ), [handleCopy, handleToggleFavorite, handleEdit, handleDelete, handleEditName, handleEditImage]);

  const ListComponent = Platform.OS === 'web' ? FlatList : FlatList;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />

      {/* Header */}
      <View style={[
        styles.header,
        {
          borderBottomColor: colors.border,
          paddingTop: verticalScale(10) + topPadding
        }
      ]}>
        <Text style={[styles.logo, { color: colors.primary, fontFamily: 'NunitoSans-Bold' }]}>
          CopiX
        </Text>
      </View>

      {/* Names List */}
      <ListComponent
        data={sortedNames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-add" size={moderateScale(isSmallScreen ? 32 : 40)} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.icon, fontFamily: 'Inter-Medium' }]}>
              No names yet. Tap + to add your first name!
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: colors.primary,
            bottom: verticalScale(30) + Math.max(insets.bottom, 20)
          }
        ]}
        onPress={() => setShowNameDialog(true)}
      >
        <Ionicons name="add" size={iconSize} color={colors.background} />
      </TouchableOpacity>

        {/* Dialogs */}
        <NameInputDialog
          visible={showNameDialog}
          onClose={() => setShowNameDialog(false)}
          onSubmit={handleAddName}
          styles={styles}
        />

        <ImageSelectionDialog
          visible={showImageDialog}
          onClose={() => setShowImageDialog(false)}
          onSelectImage={handleImageSelection}
          onSkip={handleSkipImage}
          styles={styles}
        />

        <EditDialog
          visible={showEditDialog}
          item={editingItem || undefined}
          onClose={() => {
            setShowEditDialog(false);
            setEditingItem(null);
          }}
          onEditName={handleEditName}
          onEditImage={handleEditImage}
          styles={styles}
        />

        <EditNameDialog
          visible={showEditNameDialog}
          name={editingName}
          onClose={() => {
            console.log('EditNameDialog closed');
            setShowEditNameDialog(false);
            setEditingItem(null);
            setEditingName('');
          }}
          onSave={(newName) => {
            console.log('EditNameDialog onSave called with:', newName);
            // مستقیم نام جدید را به handleSaveEditName پاس بده
            handleSaveEditName(newName);
          }}
          styles={styles}
        />

        <CopyDialog
          visible={showCopyDialog}
          name={copiedName}
          onClose={() => {
            setShowCopyDialog(false);
            setCopiedName('');
          }}
          styles={styles}
        />
      </SafeAreaView>
  );
}

