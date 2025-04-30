import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Member from '@/models/memberSchema';

// Connect to the database
connect();

export async function GET() {
    try {
        const members = await Member.find({});
        return NextResponse.json({ 
            message: 'Members fetched successfully',
            success: true,
            data: members
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const email = formData.get('email') as string;
        const additionalInfo = formData.get('additionalInfo') as string;
        const image = formData.get('image') as File;

        // Validate required fields
        if (!name || !role || !email || !image) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return NextResponse.json(
                { error: 'Email already exists. Please use a different email address.' },
                { status: 409 } // 409 Conflict - appropriate for duplicate resource
            );
        }

        try {
            // Convert image to Base64 with size checks
            const bytes = await image.arrayBuffer();
            
            // Check image size (limit to 5MB)
            if (bytes.byteLength > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: 'Image size exceeds 5MB limit' },
                    { status: 400 }
                );
            }
            
            const buffer = Buffer.from(bytes);
            const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
            
            // Save member to the database with Base64 image
            const newMember = new Member({
                name,
                role,
                email,
                image: base64Image,
                additionalInfo: additionalInfo || ""  // Ensure additionalInfo is not undefined
            });
            
            await newMember.save();
            
            return NextResponse.json({ 
                message: 'Member created successfully',
                success: true,
                data: newMember
            });
        } catch (innerError: any) {
            // Check specifically for MongoDB duplicate key error
            if (innerError.code === 11000) {
                return NextResponse.json(
                    { error: 'Email already exists. Please use a different email address.' },
                    { status: 409 }
                );
            }
            
            console.error("Image processing or database error:", innerError);
            return NextResponse.json(
                { error: `Error saving member: ${innerError.message}` },
                { status: 500 }
            );
        }
        
    } catch (error: any) {
        console.error("Outer API error:", error);
        return NextResponse.json(
            { error: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
}
