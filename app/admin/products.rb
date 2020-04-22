ActiveAdmin.register Product do
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :product_number, :name, :description, :price, :quantity_in_stock, :discount_price, :category_id, :image

  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs          # builds an input field for every attribute
    f.inputs do
      f.input :image, as: :file
    end
    f.actions         # adds the 'Submit' and 'Cancel' buttons
  end

  show do
    attributes_table do
      row :product_number
      row :name
      row :description
      row :price
      row :quantity_in_stock
      row :discount_price
      row :category
      row :created_at
      row :updated_at
      row :image do
        if product.image.attached?
          image_tag product.image, style: "width: 200px"
        else
          text_node "No image provided."
        end
      end
    end
    active_admin_comments
  end

  #
  # or
  #
  # permit_params do
  #   permitted = [:product_number, :name, :description, :price, :quantity_in_stock, :discount_price, :category_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
end
