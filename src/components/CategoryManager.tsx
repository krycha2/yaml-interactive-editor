
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Edit } from 'lucide-react';

interface CategoryManagerProps {
  categories: string[];
  onChange: (categories: string[]) => void;
  onSelect: (category: string) => void;
  selected?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onChange, 
  onSelect,
  selected
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    // Ensure the category is wrapped in quotes if it contains spaces
    const formattedCategory = newCategory.includes(' ') && !newCategory.startsWith('"') 
      ? `"${newCategory}"` 
      : newCategory;
    
    onChange([...categories, formattedCategory]);
    setNewCategory('');
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    onChange(newCategories);
  };

  const handleEditStart = (index: number) => {
    setEditIndex(index);
    // Remove quotes if they exist
    let value = categories[index];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    setEditValue(value);
  };

  const handleEditSave = () => {
    if (editIndex !== null) {
      const newCategories = [...categories];
      // Ensure the category is wrapped in quotes if it contains spaces
      const formattedCategory = editValue.includes(' ') && !editValue.startsWith('"') 
        ? `"${editValue}"` 
        : editValue;
      
      newCategories[editIndex] = formattedCategory;
      onChange(newCategories);
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'add') {
        handleAddCategory();
      } else {
        handleEditSave();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="newCategory">Add Category</Label>
          <Input
            id="newCategory"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
          />
        </div>
        <Button 
          size="sm"
          onClick={handleAddCategory}
          disabled={newCategory.trim() === ''}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <ScrollArea className="h-32 border rounded-md p-2">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No categories added yet
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-md ${
                  selected === category ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
              >
                {editIndex === index ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'edit')}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleEditSave}>Save</Button>
                  </div>
                ) : (
                  <>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => onSelect(category)}
                    >
                      {category}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(index)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CategoryManager;
