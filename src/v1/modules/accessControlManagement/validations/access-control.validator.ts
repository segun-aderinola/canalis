export const createRoleRules = {
	name: "required|string|min:5|max:100",
	description: "string|min:5|max:100",
	permissions: "required|array|min:1",
};

export const updateRoleRules = {
	id: "required|uuid",
	name: "string|min:5|max:100",
	description: "string|min:5|max:100",
	permissions: "required|array|min:1",
};

export const getRoleRules = {
	id: "required|uuid",
};

export const deleteRoleRules = getRoleRules;
