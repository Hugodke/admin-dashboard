import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectProduct } from '@/lib/db';
import { deleteProduct } from './actions';

export function Product({ product }: { product: SelectProduct }) {
  const profit = product.soldPrice ? 
    Number(product.soldPrice) - Number(product.purchasePrice) : 
    (product.sellingPrice ? Number(product.sellingPrice) - Number(product.purchasePrice) : 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-blue-100 text-blue-800';
      case 'listed': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{product.name}</span>
          {product.brand && <span className="text-sm text-muted-foreground">{product.brand}</span>}
          {product.size && <span className="text-xs text-muted-foreground">Size: {product.size}</span>}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`capitalize ${getStatusColor(product.status)}`}>
          {product.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-sm">Purchase: ${product.purchasePrice}</span>
          {product.sellingPrice && (
            <span className="text-sm text-muted-foreground">Selling: ${product.sellingPrice}</span>
          )}
          {product.soldPrice && (
            <span className="text-sm text-green-600">Sold: ${product.soldPrice}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span>{product.stock} in stock</span>
          {product.platform && (
            <span className="text-xs text-muted-foreground">{product.platform}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-sm">Purchased: {product.purchaseDate.toLocaleDateString("en-US")}</span>
          {product.soldDate && (
            <span className="text-sm text-muted-foreground">Sold: {product.soldDate.toLocaleDateString("en-US")}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
            <DropdownMenuItem>Update Price</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
              <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
