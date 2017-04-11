# vi: set ft=ruby :
VAGRANTFILE_API_VERSION = '2'
Vagrant.require_version '>= 1.8.2'

CURRENT_DIR = File.expand_path(File.dirname(__FILE__))
DIRNAME     = File.basename(CURRENT_DIR)

host  = RbConfig::CONFIG['host_os']
hosts = {
    #10.10.10.1 is configured as bridged between the host and 10.10.1.x guests
    "#{DIRNAME}.example.com"  => "10.10.10.10",
}

#execute commands in host
module LocalCommand
    class Config < Vagrant.plugin("2", :config)
        attr_accessor :command
    end
    class Plugin < Vagrant.plugin("2")
        name "local_shell"
        config(:local_shell, :provisioner) do
            Config
        end
        provisioner(:local_shell) do
            Provisioner
        end
    end
    class Provisioner < Vagrant.plugin("2", :provisioner)
        def provision
            result = system "#{config.command}"
        end
    end
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    hosts.each do |name, ip|
        config.vm.define name do |machine|
            #machine.vm.box = "ubuntu/trusty64" #base-image

            #modified base image with dependencies installed to decrease the
            #time required to bootstrap the environment, use
            #provision/repackage-vagrant-box.sh to rebuild the image
            machine.vm.box = "foobar-org/trusty64-#{DIRNAME}" #modified-base-image
            machine.vm.hostname = name
            machine.vm.network :private_network, ip: ip

            #enable remote debugging
            machine.vm.network "forwarded_port", guest: 22,   host: 2222, auto_correct: true, id:"ssh"
            machine.vm.network "forwarded_port", guest: 8081, host: 8081, auto_correct: true, id:"chrome powered debugging"
            machine.vm.network "forwarded_port", guest: 5037, host: 5037, auto_correct: true, id:"adb"
            machine.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true, id:"gotty"

            #use rsync instead of vboxfs to keep files on the guest continually
            #updated, required for live reload to work correctly
            #https://www.virtualbox.org/ticket/10660?cversion=0&cnum_hist=1
            machine.vm.synced_folder ".", "/home/vagrant/#{DIRNAME}", type: "rsync",
                rsync__args: ["--verbose", "--archive", "-z", "--copy-links"]

            #enable X11 forwarding for chrome powered debugging
            machine.ssh.forward_agent = true
            machine.ssh.forward_x11   = true

            machine.vm.provider "virtualbox" do |vbox|
                vbox.name = name
                vbox.linked_clone = true if Vagrant::VERSION =~ /^1.8/

                vbox.customize ["modifyvm", :id, "--memory", 2048]
                if host =~ /darwin/
                    cpus = `sysctl -n hw.ncpu`.to_i
                elsif host =~ /linux/
                    cpus = `nproc`.to_i
                else #windows?
                    cpus = `wmic cpu get NumberOfCores`.split("\n")[2].to_i
                end
                #vbox.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
                vbox.customize ["modifyvm", :id, "--cpus", cpus]
                #enable USB
                vbox.customize ["modifyvm", :id, "--usb", "on"]
                #vbox.customize ["modifyvm", :id, "--usbehci", "on"]
                vbox.customize ['usbfilter', 'add', '0', '--target', :id, '--name', '1197123b', '--vendorid', '0x04e8']
                vbox.customize ['usbfilter', 'add', '0', '--target', :id, '--name', 'android',  '--vendorid', '0x18d1']
            end

            #$ vagrant plugin install vagrant-hosts
            if Vagrant.has_plugin?('vagrant-hosts')
                machine.vm.provision :hosts, sync_hosts: true
            elsif Vagrant.has_plugin?('vagrant-hostmanager')
                machine.hostmanager.enabled     = true
                machine.hostmanager.manage_host = true
                machine.hostmanager.aliases     = aliases
            end

            #echo cmds, lambda syntax: http://stackoverflow.com/questions/8476627/what-do-you-call-the-operator-in-ruby
            CMD_SCRIPT_ROOT        = -> (cmd) { machine.vm.provision 'shell', path:   cmd, name: cmd, privileged: true  }
            CMD_SCRIPT             = -> (cmd) { machine.vm.provision 'shell', path:   cmd, name: cmd, privileged: false }
            CMD_INLINE_ROOT        = -> (cmd) { machine.vm.provision 'shell', inline: cmd, name: cmd, privileged: true  }
            CMD_INLINE             = -> (cmd) { machine.vm.provision 'shell', inline: cmd, name: cmd, privileged: false }
            CMD_SCRIPT_ALWAYS_ROOT = -> (cmd) { machine.vm.provision 'shell', path:   cmd, name: cmd, run: "always", privileged: false }
            CMD_SCRIPT_ALWAYS      = -> (cmd) { machine.vm.provision 'shell', path:   cmd, name: cmd, run: "always", privileged: false }

            #authorize default public ssh key
            CMD_INLINE_ROOT.call("mkdir -p /root/.ssh/")
            CMD_INLINE.call     ("mkdir -p /home/vagrant/.ssh/")
            if File.file?("#{Dir.home}/.ssh/id_rsa.pub")
                ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
                CMD_INLINE_ROOT.call("printf '\\n%s\\n' '#{ssh_pub_key}' >> /root/.ssh/authorized_keys")
                CMD_INLINE.call     ("printf '\\n%s\\n' '#{ssh_pub_key}' >> /home/vagrant/.ssh/authorized_keys")
            end

            #copy private ssh key
            if File.file?("#{Dir.home}/.ssh/id_rsa")
                machine.vm.provision "file",  source: "~/.ssh/id_rsa", destination: "/home/vagrant/.ssh/id_rsa"
                CMD_INLINE.call("chown vagrant:vagrant /home/vagrant/.ssh/id_rsa")
                CMD_INLINE.call("chmod 600 /home/vagrant/.ssh/id_rsa")
            else
                if File.file?("ansible-local/ansible-local.pub")
                    ssh_pub_key = File.readlines("ansible-local/ansible-local.pub").first.strip
                    CMD_INLINE_ROOT.call("printf '\\n%s\\n' '#{ssh_pub_key}' >> /root/.ssh/authorized_keys")
                    CMD_INLINE.call     ("printf '\\n%s\\n' '#{ssh_pub_key}' >> /home/vagrant/.ssh/authorized_keys")
                    machine.vm.provision "file",  source: "ansible-local/ansible-local.priv", destination: "/home/vagrant/.ssh/id_rsa"
                    CMD_INLINE.call     ("chown vagrant:vagrant /home/vagrant/.ssh/id_rsa")
                    CMD_INLINE.call     ("chmod 600 /home/vagrant/.ssh/id_rsa")
                end
            end

            #copy gitconfig
            if File.file?("#{Dir.home}/.gitconfig")
                machine.vm.provision "file",  source: "~/.gitconfig", destination: "/home/vagrant/.gitconfig"
            end

            #provision
            Dir.glob("#{CURRENT_DIR}/provision/0*.sh").sort.each { |provision_script|
                CMD_SCRIPT.call(provision_script)
            }

            #optional
            Dir.glob("#{CURRENT_DIR}/provision/extra-*.sh").sort.each { |provision_script|
                CMD_SCRIPT.call(provision_script)
            }

            #recurrent jobs
            Dir.glob("#{CURRENT_DIR}/provision/always-*.sh").sort.each { |provision_script|
                CMD_SCRIPT_ALWAYS.call(provision_script)
            }

            if Vagrant::Util::Platform.windows? then
                machine.vm.provision "shell", inline: 'printf "%s\\n" "Now run $ vagrant rsync-auto #to enable live reload"'
            else #unix
                machine.vm.provision "shell", inline: 'printf "%s\\n" "Launching $ vagrant rsync-auto > vagrant-rsync-auto.log"'
                machine.vm.provision 'local_shell', command: "nohup vagrant rsync-auto > #{CURRENT_DIR}/vagrant-rsync-auto.log 2>&1 &"
            end
        end
    end
end
