import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
    },

    targetId: {
      type: String,
    },

    details: Object,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AuditLog", auditLogSchema);
