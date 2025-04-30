import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Member from '@/models/memberSchema';

// Connect to the database
connect();

// Fix the type definition for route parameters
type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        
        const member = await Member.findById(id);
        
        if (!member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: 'Member fetched successfully',
            success: true,
            data: member
        });
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

// Also fix the DELETE function with the same type
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        
        const deletedMember = await Member.findByIdAndDelete(id);
        
        if (!deletedMember) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: 'Member deleted successfully',
            success: true,
        });
        
    } catch (error: unknown) {
        console.error("Error deleting member:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
