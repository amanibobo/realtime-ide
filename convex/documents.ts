import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { error } from "console";
import { queryObjects } from "v8";

export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authed");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
        throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
        throw new Error("Unauth");
    }

    const document = await ctx.db.patch(args.id, {
        isArchived: true, 
    });

    return document;
    }
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authed");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authed");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authed");
    }

    const userId = identity.subject;

    const documents = await ctx.db
    .query("documents")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => 
        q.eq(q.field("isArchived"), true),
)
    .order("desc")
    .collect();
    
return documents;
    }
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authed");
    }

    const userId = identity.subject;

    const documents = await ctx.db
    .query("documents")
    .withIndex("by_user", (q) => q.eq("userId" , userId))
    .filter((q) => 
    q.eq(q.field("isArchived"), false),
  )
  .order("desc")
  .collect();

  return documents;
  }
});

export const getbyId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authed");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthed");
    }

    return document;
  }
})

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauth");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not Found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("unauth");
    }

    const document = await ctx.db.patch(args.id, {
      ...rest
    });

    return document;
  }
})

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauth");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthed");
    } 

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    const document = await ctx.db.patch(args.id, options);

    return document;
  }
})

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauth");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("unauthed");
    }

    const document = await ctx.db.delete(args.id);
    
    return document;
  }
})