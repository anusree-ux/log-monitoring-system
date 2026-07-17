output "public_ip" {

  description = "EC2 Elastic IP"

  value = aws_eip.server_ip.public_ip

}


output "instance_id" {

  description = "EC2 Instance ID"

  value = aws_instance.server.id

}


output "ssh_command" {

  value = "ssh -i log-monitoring-key.pem ubuntu@${aws_eip.server_ip.public_ip}"

}
