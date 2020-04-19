ActiveAdmin.register Order do
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :order_number, :subtotal, :gst, :pst, :hst, :user_id, :address_id, :original_total, :discount_total,
                :status_id, order_products_attributes: %i[id product_id quantity price _destroy]

  form do |f|
    f.semantic_errors # shows errors on :base
    f.inputs
    f.inputs "Order Products" do
      f.has_many :order_products, allow_destroy: true do |opf|
        opf.input :product
        opf.input :price
        opf.input :quantity
      end
    end

    f.actions
  end

  index do
    selectable_column
    column :id
    column :order_number
    column :subtotal
    column :gst
    column :pst
    column :hst
    column :user
    column :original_total
    column :discount_total
    column :address
    column :created_at
    column :updated_at
    column :num_of_products do |order|
      order.products.size
    end
    column :status
    actions
  end

  show do
    attributes_table do
      row :id
      row :order_number
      row :subtotal
      row :gst
      row :pst
      row :hst
      row :user
      row :original_total
      row :discount_total
      row :address
      row :created_at
      row :updated_at
      row :products do |order|
        order.order_products.map { |p| "#{p.product.name} x #{p.quantity}" }.join(", ").html_safe
      end
      row :status
    end
    active_admin_comments
  end

  #
  # or
  #
  # permit_params do
  #   permitted = [:order_number, :subtotal, :gst, :pst, :hst, :user_id, :address_id, :status_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
end
