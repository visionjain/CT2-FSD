import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Member from '@/models/memberSchema';

// Connect to the database
connect();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        
    } catch (error: any) {
        console.error("Error deleting member:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
