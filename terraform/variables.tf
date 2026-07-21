variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing AWS EC2 Key Pair Name"
  type        = string
}

variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "log-monitoring-system"
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the instance (your IP/32)"
  type        = string
}
